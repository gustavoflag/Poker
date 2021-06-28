const axios = require("axios");
var FormData = require('form-data');

exports.postHands = function(req, res){

    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
    //data.append('text', 'PokerStars Hand #222551716743: Tournament #3100916457, $0.44+$0.06 USD Hold\'em No Limit - Level I (10/20) - 2021/01/12 16:55:22 BRT [2021/01/12 14:55:22 ET]\nTable \'3100916457 1\' 9-max Seat #1 is the button\nSeat 1: Hainnner (1500 in chips) \nSeat 2: Tanki_Sleva (1500 in chips) \nSeat 3: whiteashonly (1500 in chips) \nSeat 4: Mel_the_smell (1500 in chips) \nSeat 5: handvil (1500 in chips) \nSeat 6: Dommearzt (1500 in chips) \nSeat 7: mohtc (1500 in chips) \nSeat 8: f.malley (1500 in chips) \nSeat 9: flagao (1500 in chips) \nTanki_Sleva: posts small blind 10\nwhiteashonly: posts big blind 20\n*** HOLE CARDS ***\nDealt to flagao [8d 2d]\nMel_the_smell: folds \nhandvil: folds \nDommearzt: raises 20 to 40\nmohtc: folds \nf.malley: folds \nflagao: folds \nHainnner: folds \nTanki_Sleva: folds \nwhiteashonly: folds \nUncalled bet (20) returned to Dommearzt\nDommearzt collected 50 from pot\n*** SUMMARY ***\nTotal pot 50 | Rake 0 \nSeat 1: Hainnner (button) folded before Flop (didn\'t bet)\nSeat 2: Tanki_Sleva (small blind) folded before Flop\nSeat 3: whiteashonly (big blind) folded before Flop\nSeat 4: Mel_the_smell folded before Flop (didn\'t bet)\nSeat 5: handvil folded before Flop (didn\'t bet)\nSeat 6: Dommearzt collected (50)\nSeat 7: mohtc folded before Flop (didn\'t bet)\nSeat 8: f.malley folded before Flop (didn\'t bet)\nSeat 9: flagao folded before Flop (didn\'t bet)');
    
    data.append('text', req.body.text);
    data.append('filename', '');
    data.append('format', 'replayer');
    data.append('make_public', 'true');
    data.append('hide_results', 'false');
    data.append('Hide_names', 'false');
    data.append('embedded', 'false');
    data.append('skin', 'pokeit');

    var config = {
    method: 'post',
    url: 'https://pokeit.co/convert/hand.php',
    headers: { 
        ...data.getHeaders()
    },
    data : data
    };

    axios(config)
    .then(function (response) {
        //console.log(JSON.stringify(response.data));
        res.json(response.data);
    })
    .catch(function (error) {
        console.log(error);
        res.json(error);
    });

}