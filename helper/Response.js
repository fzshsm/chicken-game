
class Response{
    constructor(){
        this.init();
    }

    init(){
        this.data = {
            code : 200,
            status : 'success',
            message : 'request success!',
            result : null
        };
    }

    send(res , result){
        this.init();
        this.data.result = result;
        res.json(this.data);
    }

    error(res , error){
        this.init();
        this.data.code = 500;
        this.data.status = 'error';
        this.data.message = error;
        this.data.result = false;
        res.json(this.data);
    }
}
module.exports = new Response();