class ErrHandel{
    notFound = (req, res, next) => {
        const error = new Error(`Route ${req.originalURL} not found!`)
        res.status(404)
        next(error)
    }
    
    errHandler = (error, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode
        return res.status(statusCode).json({
            success: false,
            mes: error?.message
        })
    }
}


export default new ErrHandel;