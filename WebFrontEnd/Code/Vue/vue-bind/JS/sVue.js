function sVue(options){
    this.data=options.data
    this.methods=options.methods
    this.proxyData(this.data)
    observe(this.data)
    new compile(options.el,this)
    options.mounted.call(this)
    return this
    }

    sVue.prototype={
        proxyKeys:function(key){
            var self=this
            Object.defineProperty(this,key,{
                get:function(){
                    return self.data[key]
                },
                set(newVal){
                    self.data[key]=newVal
                }
            })
        },
        proxyData(data){
            var self=this
          Object.keys(data).forEach(function(key){
              self.proxyKeys(key)
          })
        }
    }