import React from 'react'

import { Provider,  Client, Connect, query } from 'urql'

const client = new Client({
    url: "http://localhost:4000/graphql"
})

const Centerer = (props) => (
    <div id="container">
        <div className="leftpad"></div>
        <div className="center">{props.children}</div>
        <div className="rightpad"></div>
        <style jsx>{`
            div#container {
                display: grid;
                grid-template-columns: 1fr 4fr 1fr;
            }
        `}</style>
    </div>
)

const Header = () => (
    <h1>just the fax
        <style jsx>{`
            h1 {
                text-align: center;
            }
        `}</style>
    </h1>
)

const GetFaxes = `
query {
    getFaxes {
        sid
        from
        to
        media_url
    }
}
`

const Faxes = () => (
    <Connect query={(query(GetFaxes))} children={({loaded, fetching, data, error}) => {
        if (fetching || !loaded || error || !data) return <p>a bad thing happened, be sad!</p>
        return (<ul>
            {data.getFaxes.map((f) => (
                <li key={f.sid}><a href={f.media_url}>from: {f.from} to: {f.to}</a></li>
            ))}
        </ul>)
    }}/>
)

export default () => (
    <Provider client={client}>
        <Centerer>
            <Header />
            <Faxes />
        </Centerer>
        <style jsx global>{`
            html, body {
                font-family: monospace;
            }
            li {
                padding: 1rem 0;
            }
        `}</style>
    </Provider>
)