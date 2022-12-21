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
//Original by Tomato#6966
//Panzer Shipyards Development
