module.exports = {

        list: {
         
            
        },
        serverService: {
            create: function(serverService,str) {
                serverService.create();
            },
            startv: require('./lib/startv.js'),
            stop: require('./lib/stop.js'),
            help: function() {
            console.log("|-----------------Available Commands------------------|")
            console.log("| Help                     | Shows help for commands  |")
            console.log("| Stop                     | Stops the server         |")
            console.log("|-----------------------------------------------------|")
                
            }
        }
    
    
};