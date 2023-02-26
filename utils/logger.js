//loggaa konsoliin info viestin
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

//loggaa konsoliin vihre viestin
const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params)
    }
}
  
module.exports = {
    info, error
}