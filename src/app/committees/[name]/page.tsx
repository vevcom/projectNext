

type PropTypes = {
    params: {
        name: string
    }
}

export default async function Committee({ params } : PropTypes) {
    console.log(params.name)
    return(params.name)
}