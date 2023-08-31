import Link from "next/link"

function Item({ href, name, pl0 }) {
    pl0 = !!pl0
    return (
        <li class="nav-item">
            <Link class={pl0 ? "nav-link" : "nav-link pl0"} href={href}>
                <div class="link-animation">{name}</div>
            </Link>
        </li>
    )
}

export default Item