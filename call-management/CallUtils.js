class CallUtils {
    static showCalls(calls) {
        if (calls.length > 0) {
            calls.forEach(element => {
                console.log("  Call id: " + element.callId + ", destination: " + element.destinationExtension + ", state: " + element.callState)    
            });
        } else {
            console.log("  No calls")
        }
    }
}  

module.exports = CallUtils;
