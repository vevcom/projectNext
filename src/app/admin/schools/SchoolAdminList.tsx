import type { SchoolFiltered } from "@/services/schools/Types"

type PropTypes = {
    schools: SchoolFiltered[]
}

export async function SchoolAdminList({ schools }: PropTypes) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Navn</th>
                    <th>Kortnavn</th>
                </tr>
            </thead>
            <tbody>
                {schools.map(school => (
                    <tr key={school.id}>
                        <td>{school.id}</td>
                        <td>{school.name}</td>
                        <td>{school.shortname}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}