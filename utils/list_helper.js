const dummy = (blogs) => {
    const lkm = 1
    console.log(blogs)
    return lkm
}

const totalLikes = (blogs) => {
    var lkm = 0
    for (var i=0;i<Object.keys(blogs).length; i++) { 
        const luku = blogs[i].likes
        lkm = lkm + luku
    }
    return lkm
}


module.exports = {
    dummy,
    totalLikes
}