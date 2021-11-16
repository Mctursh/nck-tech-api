//handler that handles error for promises
const handleError = (promise) => {
  return promise
    .then(data => ([data, undefined]))
    .catch(error => {
        console.log(error);
        return Promise.resolve([undefined, error])
    });
}

module.exports ={ handleError }