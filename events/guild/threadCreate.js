//The Module
module.exports = async (client, thread) => {
    try{
        if(thread.joinable && !thread.joined){
            await thread.join();
        }
    }catch (e){
        console.log(String(e).grey)
    }
}
//Improved by paninizer#8583
//Original by paninizer#8583
//Panzer Shipyards Development
