"use strict";

var dataArr = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
            'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];
var normalTime = 70,
	hardTime   = 50,
	maxTime,
	ncards	   = 24,
	point	   = 0,
	timeleft,
	remainTime,
	current    = 0,
	dataIDfirst,
	dataIDsecond;

function shuffle(dataArr) {
    let counter = dataArr.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = dataArr[counter];
        dataArr[counter] = dataArr[index];
        dataArr[index] = temp;
    }

    return dataArr;
} // OK

function loadContent() {
    var cards = shuffle(dataArr);
    var temp = "";
    for (var i = 0; i < cards.length; i++) {
        temp += "<div class='grid'><div class='card' onclick='flip(this)' data-id='" + cards[i] 
        + "'><div class='front'><img src='images/back.jpg'></div><div class='back'><img src='images/" 
        + cards[i] + ".jpg'></div></div></div>";
    }
    $(".content").html(temp);
    openModal(".begin");
    loadBg();
} // OK

function loadBg() {
	var index = Math.floor(Math.random() * 3) + 1;
	$("body").css('background-image', 'url(images/bg'+index+'.jpg)');
} // OK

function openModal(item) {
	$(item).fadeIn();
} // OK

function closeModal() {
	$(".modal").hide();
} // OK

function startGame(item) {
	//loadContent();
	if (item == 1) {
		normalTime = timeleft = maxTime = 70;
	} else {
		normalTime = timeleft = maxTime = 50;
	}
	point = 0;
	$(".progressbar progress").attr('max', maxTime);
	closeModal();
	playSound("bgmusic");
	countdown();
} // OK

function countdown() {
	remainTime = setInterval(function() {
		switch (timeleft) {
			case 10: playSound("ten_seconds"); break;
			case 5: playSound("five_seconds"); break;
			case 0: 
				clearInterval(remainTime);
				$(".lose").css('display', 'block');
				stopSound("bgmusic");
				playSound("lose");
				break;
		}
		$(".progressbar progress").attr('value', timeleft);
		console.log(timeleft);
		timeleft--;
	}, 1000);
} // OK

function playSound(item) {
	document.getElementById(item + '-sound').load();
	document.getElementById(item + '-sound').play();
} // OK

function stopSound(item) {
	document.getElementById(item + '-sound').pause();
} // OK

function flip(item) {
	current++;
	(current === 1) ? dataIDfirst = $(item).attr('data-id') : dataIDsecond = $(item).attr('data-id');

	$(item).addClass('flipped');
	$(item).removeAttr('onclick');
	$(item).css('pointer-events', 'none');
	playSound('flip');
	if (current === 2) {
		$(".card").css('pointer-events', 'none');
		if (dataIDfirst !== dataIDsecond) { // incorrect
			setTimeout(function() {
				$('.content').find('.flipped').attr('onclick', 'flip(this)');
				$('.content').find('.flipped').removeClass('flipped');
				playSound("incorrect");
				$(".card").css('pointer-events', 'auto');
			}, 600);
		} else { // correct
			point++;
			setTimeout(function() {
				$('.content').find('.flipped').css('opacity', 0);
				$('.content').find('.flipped').addClass('hiddenC');
				$('.content').find('.flipped').removeClass('flipped');
				playSound("correct");
				$(".card").css('pointer-events', 'auto');
			}, 600);
		}
		
		// victory
		if (point === 12) {
			clearInterval(remainTime);
			stopSound("bgmusic");
			playSound("win");
			openModal(".win"); 
		}
		
		current = 0;
	}
} // OK?



$(document).ready(function() {
	document.getElementById("flip-sound").volume = .4;
	document.getElementById("correct-sound").volume = .4;
	document.getElementById("incorrect-sound").volume = .4;
	loadContent();
    console.log('document');
});


$(window).on('load', function(event) {
	// event.preventDefault();
	$('body').css('overflow', 'auto');
    $('body').removeClass('preloading');
    $('#preload').delay(1000).fadeOut('fast');
    console.log('window');
});