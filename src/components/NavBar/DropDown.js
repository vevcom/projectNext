import Link from "next/link"

function DropDown({ name, items }) {
  return (
    <li class="nav-item dropdown">
        <a class="nav-link" href="#" data-bypass="1" id="nav-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div>{ name }<i class="fas fa-caret-down ml-2"></i></div>
        </a>
        <div class="dropdown-menu" aria-labelledby="nav-dropdown">
            <div class="row no-gutters">
            {items.map(item => 
                <div class="col">
                    <Link class="dropdown-item dropdown-icon d-flex justify-content-center" href={item.href}>
                        <div class="align-self-center text-center">
                            <i class="fas fa-newspaper fa-2x"></i>
                            <h2 class="mt-1">{item.name}</h2>
                        </div>
                    </Link>
                </div>
            )}
            </div>
        </div>
    </li>
  )
}

export default DropDown