import React from 'react'

import { Provider,  Client, Connect, query, mutation } from 'urql'

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
mutation($from: String, $to: String, $mediaUrl: String) {
    sendFax(from: $from, to: $to, mediaUrl: $mediaUrl) {
        sid
        from
        to
        media_url
    }
}
`

const Faxes = () => (
    <Connect query={(query(GetFaxes))} mutation={{ sendFax: mutation(SendFax) }} children={({loaded, fetching, data, error, sendFax}) => {
        if (fetching || !data) return <p style={{textAlign: 'center'}}>[[[[[[[[[[[[[[[[[modem noises]]]]]]]]]]]]]]]]]</p>
        if (loaded && error) return <p style={{textAlign: 'center'}}>a bad thing happened, be sad!</p>
        return (
            <React.Fragment>
                <FaxList data={data} />
                <FaxForm onSubmit={sendFax}/>
            </React.Fragment>
        )
    }}/>
)

const FaxList = ({data}) => (
    <div className="fax-list">
        <h2>recent faxes:</h2>
        <ul>
            {data.getFaxes.map((f) => (
                <li key={f.sid}>
                        from: {f.from} to: {f.to} <a href={f.media_url} target="_blank" rel="noopener noreferrer">(view)</a>
                </li>
            ))}
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
        mediaUrl: ''
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
                <formgroup>
                    <label htmlFor="from">from: </label>
                    <input type="text" name="from" id="to" placeholder="from" onChange={(e) => this.handleChange('from', e.target.value)}></input>
                </formgroup>
                <formgroup>
                    <label htmlFor="to">to: </label>
                    <input type="text" name="to" id="to" placeholder="to" onChange={(e) => this.handleChange('to', e.target.value)}></input>
                </formgroup>
                <formgroup>
                    <label htmlFor="media_url">media url: </label>
                    <input type="text" name="media_url" id="media_url" placeholder="media url" onChange={(e) => this.handleChange('mediaUrl', e.target.value)}></input>
                </formgroup>
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
                formgroup {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 0;
                }
                button {
                    padding: 1rem;
                    margin: 1rem 0 0 0;
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