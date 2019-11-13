export default ( path, options ) => fetch ( 
    `/api/${path}`, 
    { ...options }
).then( data => data.json() )