export const shortAddress = (address:string) =>{
    return address.slice(0,6).concat("...").concat(address.slice(-4))
}