import Link from "next/link"

function DropDown({ name, items }) {
  return (
    <li>
        <div>{ name }</div>
        <select name={name}>
            {items.map(item => 
                <option>
                    <Link href={item.href}>
                        <div>       
                            <i></i>
                            <h2>{item.name}</h2>
                        </div>
                    </Link>
                </option>
            )}
        </select>
    </li>
  )
}

export default DropDown