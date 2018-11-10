# just the fax

A web interface for Twilio's awesome [Programmable Fax API](https://www.twilio.com/fax/api). Cooked up as a self-care project of sorts, and also because I needed to fax something.

## setup

Set up your Twilio Account SID, Twilio API key, and desired external API key as environment variables:

```
export TWLO_SID='Axxxxxxxxxxxxxxxxxxxx'
export TWLO_KEY='Axxxxxxxxxxxxxxxxxxxx'
export API_KEY='some-gibberish-probably-a-uuid-or-something'
```

I recommend using [`direnv`](https://github.com/direnv/direnv) to expose env vars in a `.envrc` file in the root (`./`) of this project. I created a sample `.envrc` file at `./envrc.sample` – just rename it to `.envrc` and edit the values and you should be off to the races!

### api

In the `./api/` directory, you'll find an Apollo Server project. Run `yarn dev` to launch the server on port 4000.

### web

In the `./web/` directory, you'll find a Next.js project. Run `yarn dev` to launch the server on port 3000.

## a word of caution

Pick a solid-ish API key, and consider using a real authentication method (like, something with tokens that expire) rather than the simple thing I cooked up. Doubly so, if you're planning on exposing this to the world. I'm only ever running this locally, so a simple API key like this is pretty reasonable.