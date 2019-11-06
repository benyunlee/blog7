
var audio = new Audio()
audio.autoplay = true


var musicList = []
var currentIndex = 0



function $(selector){
    return document.querySelector(selector)
}

getMusicList( function(list){
    musicList = list
    console.log(list)
 //    var song = list[0]
 //    var audioObject = new Audio(song.src)
 //    audioObject.play()
 loadMusic(list[currentIndex])
})

function loadMusic(musicObj){   // 获取歌曲的歌名 地址 作者 
 //    console.log('begin play', musicObj )
    $('.info .title').innerText = musicObj.title
    $('.control .author').innerText = musicObj.author 
    $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
    audio.src = musicObj.src
    
}

audio.ontimeupdate = function (){
 //    console.log(this.currentTime)
 //    console.log(this.duration)
 $('.bar .progress-now').style.width = (this.currentTime / this.duration)*100 +'%'
 
 // 时间显示用ontimeupdate来监听会产生时间跳动不均匀的情况,所以要用 interval
 
}
audio.onplay =  function (){
    clock = setInterval(function(){
         var min = Math.floor(audio.currentTime/60) 
         var sec = Math.floor(audio.currentTime%60) 
         var sec1 =  (sec+'').length === 2? sec : '0'+sec
         var showtime = min +':'+ sec1
         $('.progress .showtime').innerText = showtime  
    },1000)
}
audio.onpause = function(){
    clearInterval(clock)
}

$('.control .play').onclick = function (){
 //    audio.pause()
    if(audio.paused){
     this.querySelector('.fa').classList.remove('fa-pause')
     this.querySelector('.fa').classList.add('fa-play')
     audio.play()
    }else{
     this.querySelector('.fa').classList.remove('fa-play')
     this.querySelector('.fa').classList.add('fa-pause') 
     audio.pause()
    }      
}


$('.control .forward').onclick = function (){
   currentIndex = (++currentIndex) % musicList.length //    一个列表的正负循环写法
   loadMusic(musicList[currentIndex])        
}
$('.control .back').onclick = function (){
   currentIndex = (musicList.length + (--currentIndex))%musicList.length //    一个列表的正负循环写法
   loadMusic(musicList[currentIndex])        
}

$('.progress .bar').onclick = function(e){
   console.log(e)
   var percent = e.offsetX / parseInt(getComputedStyle(this).width)
   console.log(percent)
   audio.currentTime = percent * audio.duration

 //   audio.currentTime = e.offsetX
}
audio.onended = function(){
 currentIndex = (++currentIndex) % musicList.length
   loadMusic(musicList[currentIndex])
}




function getMusicList(callback){
     var xhr = new XMLHttpRequest()
     xhr.open("GET","/musiclist.json",true)
     xhr.onload = function(){
         if( (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
             //    var windowMusicList = JSON.parse(this.responseText)
             //     console.log(windowMusicList)
             // var data = this.responseText
             // console.log(typeof data )
                 callback(JSON.parse(this.responseText))
         }else {
             console.log('获取数据失败')
         }
     }
     xhr.onerror = function (){
         console.log('网络异常')
     }
     xhr.send()
}