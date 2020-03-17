function startCanvas(){
  var start = false

  // Canvas
  var canvas = document.querySelector("#canvas")
  var ctx = canvas.getContext("2d")

  // Object
  var faiqaDeath = new Image(); faiqaDeath.src = 'img/death.png'
  var faiqaFly = new Image(); faiqaFly.src = 'img/fly.png'
  var faiqaRun = new Image(); faiqaRun.src = 'img/run.png'
  var faiqaEat = new Image(); faiqaEat.src = 'img/eat.png'
  var roadImage = new Image(); roadImage.src = 'img/road.png'
  var cakeImage = new Image(); cakeImage.src = 'img/cake.png'
  var obstacleImage = new Image(); obstacleImage.src = 'img/obstacle.png'

  canvas.width = canvas.scrollWidth; canvas.height = canvas.scrollHeight
  var cW = canvas.width; var cH = canvas.height

  splash()
  function splash(){
    document.querySelector('.positionSplash').innerHTML='<div style="color:#FFF;font-size:30px;font-weight:600;padding:10px;background:#000">FLYING FAIQA!</div><div style="margin-top:100px"><img src="img/fly.png" width="100" /></div><div style="margin-top:100px;color:#FFF"><h1>TEKAN UNTUK MEMULAI</h1></div><img src="img/road.png" style="z-index:-1;width:100%;position:absolute;bottom:0;left:0" />'
    document.querySelector('.position').style.display='none'
  }

  document.querySelector('.positionSplash').addEventListener('click', function(){
    document.querySelector('.positionSplash').style.display='none'
    document.querySelector('.position').style.display='block'
    if (start == false) {
      start = true
      game()
    }
  })

  function game(){
    var hbdSong = document.querySelector("#hbd")
    hbdSong.play()
    hbdSong.volume = 0.4
    var score = 0
    var scoreFly = 0
    var live = 100
    var interval

    var deathVal = false
    var eatVal = false
    var flyVal = false

    function Char(){
      this.x = 170; this.y = 500
      this.w = 70; this.hFly = 120; this.hSquare = 80
      this.render = function(){
        if (deathVal) {
          ctx.drawImage(faiqaDeath, this.x, this.y, this.w, this.hSquare)
        }
        else if (eatVal) {
          ctx.drawImage(faiqaEat, this.x, this.y, this.w, this.hSquare)
          setTimeout(function(){
            eatVal = false
          }, 500)
        }
        else if (flyVal) {
          ctx.drawImage(faiqaFly, this.x, this.y, this.w, this.hFly)
          scoreFly = 0
        }
        else{
          ctx.drawImage(faiqaRun, this.x, this.y, this.w, this.hSquare)
        }
      }
    } // Char()
    var char = new Char()

    function Road(){
      this.x = 0; this.y = -198500
      this.w = 345; this.h = 199300
      this.render = function(){
        ctx.drawImage(roadImage, this.x, this.y++, this.w, this.h)
      }
    } // Road()
    var road = new Road()

    var cakeObj = []
    addCake()
    function addCake(){
      var x=0,y=0,w=60,h=60
      var randCake = Math.floor(Math.random()*250)
      cakeObj.push({"x":x+randCake,"y":y-100,"w":w,"h":h})
    }
    var countCakeDistance = 0

    function renderCake(){
      for (var i = 0; i < cakeObj.length; i++) {
        var co = cakeObj[i]
        ctx.drawImage(cakeImage,co.x,co.y++,co.w,co.h)
      }
      countCakeDistance++
      if (countCakeDistance == 1000) {
        cakeObj.shift()
        addCake()
        countCakeDistance = 0
      }
    }

    var obstacleObj = []
    addObstacle()
    function addObstacle(){
      var x=0,y=0,w=60,h=60
      var randObstacle = Math.floor(Math.random()*250)
      obstacleObj.push({"x":x+randObstacle,"y":y-100,"w":w,"h":h})
      obstacleObj.push({"x":x+randObstacle+50,"y":y-500,"w":w,"h":h})
      obstacleObj.push({"x":x+randObstacle+40,"y":y-800,"w":w,"h":h})
    }
    var countObstacleDistance = 0

    function renderObstacle(){
      for (var i = 0; i < obstacleObj.length; i++) {
        var oo = obstacleObj[i]
        ctx.drawImage(obstacleImage,oo.x,oo.y++,oo.w,oo.h)
      }
      countObstacleDistance++
      if (countObstacleDistance == 800) {
        obstacleObj.shift()
        addObstacle()
        countObstacleDistance = 0
      }
    }

    function getCake(){
      for (var i = 0; i < cakeObj.length; i++) {
        var co = cakeObj[i]
        if (co.y-char.y < 50 && co.y-char.y > 0 && co.x-char.x < 50 && co.x-char.x > -50) {
          eatVal = true
          scoreFly = scoreFly+1
          if (scoreFly == 5) {
            live = live+25
            document.querySelector("#yey").play()
          }
          else{
            document.querySelector("#nyamNyam").play()
          }
          cakeObj.shift()
          score = score+1
        }
      }
    }

    function getObstacle(){
      for (var i = 0; i < obstacleObj.length; i++) {
        var oo = obstacleObj[i]
        if (oo.y-char.y < 50 && oo.y-char.y > 0 && oo.x-char.x < 50 && oo.x-char.x > -50) {
          if (flyVal == false) {
            document.querySelector("#aduh").play()
            live = live-1
          }
        }
      }
    }

    function gameOver(){
      deathVal = true
      if (deathVal) {
        document.querySelector("#yahKalahDeh").play()

        ctx.fillStyle = "#FFF"
        ctx.font = "bold 60px verdana, sans-serif"
        ctx.fillText('Kalah!',90,200)

        ctx.font = "bold 30px verdana, sans-serif"
        ctx.fillText('Skormu: '+score,95,300)
        canvas.addEventListener("click", function(e) {
          location.reload()
        })
        clearInterval(interval)
      }
    }

    function rule(){
      if (char.x < 10 || char.x > 300) {
        gameOver()
      }
      if (live < 1) {
        gameOver()
      }
      if (scoreFly == 5) {
        flyVal = true
        setTimeout(function(){
          scoreFly = 0
          flyVal = false
        },15000)
      }
    }

    function animate(){
      ctx.save()
      ctx.clearRect(0,0,cW,cH)

      road.render()
      renderObstacle()
      renderCake()
      getCake()
      getObstacle()
      rule()
      char.render()

      ctx.font = "bold 20px verdana, sans-serif"
      ctx.fillStyle = "#FFF"
      ctx.fillText('Skor: '+score,20,30)
      ctx.fillText('Nyawa: '+live,20,50)

      ctx.restore()
    } // animate()

    var interval = setInterval(animate,3)

    // keybinding
    canvas.addEventListener("click", function(e) {
      if (e.pageX-$(canvas).offset().left < 100) {
        char.x-=70
      }
      else if(e.pageX-$(canvas).offset().left > 250){
        char.x+=70
      }
    })
  } // game()

} // startCanvas()

window.addEventListener('load', function(){
  startCanvas()
})
