# just the fax

A web interface for Twilio's awesome [Programmable Fax API](https://www.twilio.com/fax/api). Cooked up as a self-care project of sorts, and also because I needed to fax something.

## setup

Set up your Twilio Account SID and Key in environment variables:

```
export TWLO_SID='Axxxxxxxxxxxxxxxxxxxx'
export TWLO_KEY='Axxxxxxxxxxxxxxxxxxxx'
```

### api

In the `./api/` directory, you'll find an Apollo Server project. Run `yarn dev` to launch the server on port 4000.

### web

In the `./web/` directory, you'll find a Next.js project. Run `yarn next dev` (yeah, I didn't alias that quite yet) to launch the server on port 3000.
