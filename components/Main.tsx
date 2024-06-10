type MainProps = {
    children: React.ReactNode
}

export default function Main({children}: MainProps)
{
    return <main className="py-5 grow">
        {children}
    </main>
}