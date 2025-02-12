const environment = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : '.env'

module.exports = environment