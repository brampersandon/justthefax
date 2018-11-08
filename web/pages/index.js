import React from 'react'
import getConfig from 'next/config'

import { Provider,  Client, Connect, query, mutation } from 'urql'

const { publicRuntimeConfig } = getConfig() 
const { API_KEY } = publicRuntimeConfig

const client = new Client({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        headers: {
            'authorization': `Bearer ${API_KEY}`,
            'content-type': 'application/json'
        }
    }
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

            @media (min-width: 1200px) {
                div#container {
                    grid-template-columns: 1fr 1fr 1fr;
                }
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

const SendFax = `
mutation($from: String, $to: String, $media_url: String) {
    sendFax(from: $from, to: $to, media_url: $media_url) {
        sid
        from
        to
        media_url
    }
}
`

const Faxes = () => (
    <Connect query={(query(GetFaxes))} mutation={{ sendFax: mutation(SendFax) }} children={({loaded, fetching, refetch, data, error, sendFax}) => {
        return (
            <React.Fragment>
                {fetching && <p style={{textAlign: 'center'}}>[[[[[[[[[[[[[[[[[modem noises]]]]]]]]]]]]]]]]]</p>}
                {error && <p style={{textAlign: 'center'}}>a bad thing happened, be sad!</p>}
                {data && <FaxList data={data} refetch={refetch} />}
                {loaded && <FaxForm onSubmit={sendFax}/>}
            </React.Fragment>
        )
    }}/>
)

const FaxList = ({data, refetch}) => (
    <div className="fax-list">
        <h2>recent faxes:</h2>
        <div className="fax-list--actions">
            <button onClick={() => refetch({ skipCache: true })}>reload</button>
        </div>
        <ul>
            {
                (data && data.getFaxes)
                    ? data.getFaxes.map((f) => (
                        <li key={f.sid}>
                                from: {f.from} to: {f.to} <a href={f.media_url} target="_blank" rel="noopener noreferrer">(view)</a>
                        </li>
                    ))
                    : <li>no faxes yet...you sure you know what you're doing?</li>
            }
        </ul>
        <style jsx>{`
            div.fax-list {
                padding: 4rem;
                display: flex;
                flex-direction: column;
            }
        `}</style>
    </div>
)

class FaxForm extends React.Component {
    state = {
        from: '',
        to: '',
        media_url: ''
    }

    handleChange(k, v) {
        this.setState({
            [k]: v
        })
    }

    onSubmit() {
        if (Object.values(this.state).some(v => v === '')) return alert('no fax for you! fill out the fields, ya goof!')
        this.props.onSubmit(this.state)
    }

    render() {
        return (
        <div className="fax-form">
            <h2>send a fax</h2>
            <p>this form will send <strong>real faxes</strong>, no kidding.</p>
            <div className="innards">
                <div className="input-group">
                    <label htmlFor="from">from: </label>
                    <input type="text" name="from" id="to" placeholder="from" onChange={(e) => this.handleChange('from', e.target.value)}></input>
                </div>
                <div className="input-group">
                    <label htmlFor="to">to: </label>
                    <input type="text" name="to" id="to" placeholder="to" onChange={(e) => this.handleChange('to', e.target.value)}></input>
                </div>
                <div className="input-group">
                    <label htmlFor="media_url">media url: </label>
                    <input type="text" name="media_url" id="media_url" placeholder="media url" onChange={(e) => this.handleChange('media_url', e.target.value)}></input>
                </div>
            </div>
            <div className="actions">
                <button onClick={() => this.onSubmit()}>commence!</button>
            </div>
            <style jsx>{`
                div.fax-form {
                    background-color: #696969;
                    color: white;
                    padding: 4rem;
                    display: flex;
                    flex-direction: column;
                }
                div.input-group {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 0;
                }
            `}</style>
        </div>
        )
    }
}

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