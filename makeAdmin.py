# pip install psycopg2-binary
# pip install python-dotenv
import os
from dotenv import load_dotenv
import sys
import psycopg2

PERMISSIONS_TO_ADD = [ "USERS_READ", "USERS_UPDATE" ]

def main():
    load_dotenv()

    if (len(sys.argv) < 2):
        print("This tool will make a user admin, by creating a admin role, and a Vevcom comittee.")
        print("Usage: <username>")
        print("Please spesify the username to the user that will become admin. Make sure that the user exists.")
        return

    DB_USER = os.getenv("DB_USERNAME")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")

    connection = psycopg2.connect(
        host="localhost",
        port=5432,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

    username = sys.argv[1]

    with connection.cursor() as cur:
        cur.execute('SELECT * FROM "User" WHERE "username" = %s', (username, ))
        user = cur.fetchone()

    if (user is None):
        print(f"No user found with username: {username}")
        connection.close()
        return

    with connection.cursor() as cur:
        cur.execute('SELECT id FROM "Role" WHERE LOWER("name") = \'admin\'')
        role = cur.fetchone()


    if (role is None):
        print("Role Admin does not exist, creating one...")
        with connection.cursor() as cur:
            cur.execute('INSERT INTO "Role" (name) VALUES (\'Admin\') RETURNING id')
            role = cur.fetchone()

            if (role is None):
                raise Exception("Failed to insert Role")

            for permission in PERMISSIONS_TO_ADD:
                cur.execute('INSERT INTO "RolePermission" ("roleId", "permission") VALUES (%s, %s)', (role[0], permission))

    with connection.cursor() as cur:
        cur.execute('SELECT "groupId", "id" from "ManualGroup" WHERE LOWER("shortName") = \'admin\'')
        manualGroup = cur.fetchone()

    if (manualGroup is None):
        print("Manualgroup Admin does not exist, creating one...")
        with connection.cursor() as cur:
            # Get the latest order
            cur.execute('SELECT "order" FROM "OmegaOrder" ORDER BY "order" DESC LIMIT 1')
            order = cur.fetchone()
            if (order is None):
                raise Exception("No Omega Orders exists")
            order = order[0]

            cur.execute('INSERT INTO "Group" ("groupType", "order") VALUES (\'MANUAL_GROUP\', %s) RETURNING id', (order, ))
            groupId = cur.fetchone()
            if (groupId is None):
                raise Exception("Failed to insert group")
            groupId = groupId[0]

            cur.execute('INSERT INTO "ManualGroup" ("name", "shortName", "groupId") VALUES (\'Admin\', \'Admin\', %s) RETURNING "groupId", "id"', (groupId, ))
            manualGroup = cur.fetchone()
            if (manualGroup is None):
                raise Exception("Failed to insert Manual group")

    groupId = manualGroup[0]
    roleId = role[0]

    with connection.cursor() as cur:
        cur.execute('INSERT INTO "RolesGroups" ("groupId", "roleId", "forAdminsOnly") VALUES (%s, %s, false)', (groupId, roleId))

    connection.commit()
    connection.close()

if __name__ == "__main__":
    main()
