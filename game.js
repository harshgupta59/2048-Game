document.addEventListener('DOMContentLoaded',()=>{

    const gridDisplay=document.querySelector(".grid");
    const scoreDeisplay=document.querySelector("#score");
    const resultDisplay=document.querySelector("#result")
    size=4;
    score=0

    //represent value with div
    let squares=[]
    
    //key pressed
    const keyPressed=(e)=>{
        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
            upKey()
        }
        else if (e.keyCode == '40') {
            // down arrow
            downKey()
        }
        else if (e.keyCode == '37') {
            leftKey()
        // left arrow
        }
        else if (e.keyCode == '39') {
            rightKey()
        // right arrow
        }
    }

    document.addEventListener('keyup',keyPressed)

    //addcolor
    function addColor(){
        for(let i=0;i<squares.length;i++){
            if(squares[i].innerHTML==2){
                squares[i].style.backgroundColor = "GREY";
            }
            else if(squares[i].innerHTML==4){
                squares[i].style.backgroundColor = "TURQUOISE";
            }
            else if(squares[i].innerHTML==8){
                squares[i].style.backgroundColor = "MAGENTA";
            }
            else if(squares[i].innerHTML==16){
                squares[i].style.backgroundColor = "GREEN";
            }
            else if(squares[i].innerHTML==32){
                squares[i].style.backgroundColor = "ORANGE";
            }
            else if(squares[i].innerHTML==64){
                squares[i].style.backgroundColor = "NAVY";
            }
            else if(squares[i].innerHTML==128){
                squares[i].style.backgroundColor = "PINKY";
            }
            else if(squares[i].innerHTML==256){
                squares[i].style.backgroundColor = "YELLOW";
            }
            else if(squares[i].innerHTML==512){
                squares[i].style.backgroundColor = "BROWN";
            }
            else if(squares[i].innerHTML==1024){
                squares[i].style.backgroundColor = "DarkSalmon";
            }
            else if(squares[i].innerHTML==2048){
                squares[i].style.backgroundColor = "RED";
            }
            else{
                squares[i].style.backgroundColor ="lightgrey";
            }
            
        }
    }

    //generate random number
    const generateRandom=(val=0)=>{ 
        let options=[];
        for(let i=0;i<squares.length;i++){
            if(squares[i].innerHTML == 0){
                options.push(i);
            }
        }
      //  console.log(options);
        if(options.length>0){
           // alert("fd");
            let spot= Math.floor(Math.random() * options.length)
            let r = Math.random();
            let num=0;
            if(val==0){
                num = r>0.5? 2: 4;
            }
            else{
                num = val;
            }
            squares[options[spot]].innerHTML=num;

            //     var colors = ['#ff0000', '#00ff00', '#0000ff'];
            // var random_color = colors[Math.floor(Math.random() * colors.length)];
            // document.body.style.backgroundColor = random_color;

                
                
        }
        else{
            resultDisplay.innerHTML = 'YOU LOSE'
            alert("YOU LOSE")
            document.removeEventListener('keyup',keyPressed)
        }
    }

    //merge equal adjacent pairs
    function mergeRow(){
        for(let i=0;i<squares.length-1;i++){
            let a=parseInt(squares[i].innerHTML);
            let b=parseInt(squares[i+1].innerHTML);
           if((i+1)%4!==0 && a==b){
               squares[i+1].innerHTML=a+b
               squares[i].innerHTML=0;
               score+=a+b
               scoreDeisplay.innerHTML = score
           }
        }
        checkforWin()
    }


    function mergeCol(){
        for(let i=0;i<squares.length-4;i++){
            let a=parseInt(squares[i].innerHTML);
            let b=parseInt(squares[i+size].innerHTML);
           if(a==b){
               squares[i+size].innerHTML=0
               squares[i].innerHTML=a+b;
               score+=a+b
               scoreDeisplay.innerHTML = score
           }
        }
        checkforWin()
    }

    //swipe left
    function swipeLeft(){
        for(let i=0;i<squares.length;i=i+4){
           
            if(i%4 === 0){
                let rows=[]
                for(let j=0;j<4;j++){
                    rows.push(parseInt(squares[i+j].innerHTML))
                }
                
                //row containing zeros will be removed
                let filteredRows = rows.filter(val => val)
                let missing = 4 - filteredRows.length
                let zeros = Array(missing).fill(0);
                filteredRows = filteredRows.concat(zeros)
              //  console.log(filteredRows)

                for(let j=0;j<4;j++){
                    squares[i+j].innerHTML = filteredRows[j];
                }
            }
        }
    }


    //swipe right
    function swipeRight(){
        for(let i=0;i<squares.length;i=i+4){
            // alert("Dc");
            if(i%4 === 0){
                let rows=[]
                for(let j=0;j<4;j++){
                    rows.push(parseInt(squares[i+j].innerHTML))
                }
                
                //row containing zeros will be removed
                let filteredRows = rows.filter(val => val)
                let missing = 4 - filteredRows.length
                let zeros = Array(missing).fill(0);
                filteredRows = zeros.concat(filteredRows)
             //   console.log(filteredRows)

                for(let j=0;j<4;j++){
                    squares[i+j].innerHTML = filteredRows[j];
                }
            }
        }
    }


    function swipeUp(){
       
        for(let i=0;i<size;i++){
            let cols=[]
            for(let j=0;j<4;j++){
                cols.push(parseInt(squares[i+size*j].innerHTML))
            }

            let filteredCols = cols.filter(val => val)
            let missing = 4 - filteredCols.length
            let zeros = Array(missing).fill(0)
            filteredCols = filteredCols.concat(zeros)
         //   alert("Dsv")
            for(let j=0;j<4;j++){
                squares[i+size*j].innerHTML = filteredCols[j];
            }
        }
    }


    function swipeDown(){
       
        for(let i=0;i<size;i++){
            let cols=[]
            for(let j=0;j<4;j++){
                cols.push(parseInt(squares[i+size*j].innerHTML))
            }

            let filteredCols = cols.filter(val => val)
            let missing = 4 - filteredCols.length
            let zeros = Array(missing).fill(0)
            filteredCols = zeros.concat(filteredCols)
         //   alert("Dsv")
            for(let j=0;j<4;j++){
                squares[i+size*j].innerHTML = filteredCols[j];
            }
        }
    }


    function rightKey(){

        swipeRight()
        mergeRow()
        swipeRight()
        generateRandom()
        addColor()
    }

    function leftKey(){

        swipeLeft()
        mergeRow()
        swipeLeft()
        generateRandom()
        addColor()
    }

    function upKey(){
        
        swipeUp()
        mergeCol()
        swipeUp()
        generateRandom()
        addColor()
    }

    function downKey(){
        
        swipeDown()
        mergeCol()
        swipeDown()
        generateRandom()
        addColor()
    }


    function createBoard(){
        //alert("DSV");
        for(let i=0;i<size*size;i++){
            var square=document.createElement('div')
            square.innerHTML = 0;
            gridDisplay.appendChild(square);
            squares.push(square)
        }
        generateRandom(2)
        generateRandom(4)
        addColor()
   //swipeRight()
    }

    createBoard()
   
    //checkforwin
    function checkforWin(){
        for(let i=0;i<squares.length;i++){
            if(squares[i].innerHTML==2048){
                resultDisplay.innerHTML = 'YOU WIN'
                alert("YOU WON")
                document.removeEventListener('keyup',keyPressed)
            }
        }
    }

})


//trying
 // function rotateLeft(){
    //     let rotatedSquares=[]
    //     for(let i=size-1;i>=0;i--){
    //         for(let j=0;i+j<size*size;j+=4){
    //             rotatedSquares.push(parseInt(squares[i+j].innerHTML));
    //         }
    //     }
    //     for(let i=0;i<size*size;i++){
    //         squares[i].innerHTML=rotatedSquares[i];
    //     }
    // }
    
    // function rotateRight(){
    //     let rotatedSquares=[]
    //     for(let i=0;i<size;i++){
    //         let row=[]
    //         for(let j=0;i+j<size*size;j+=4){
    //             row.push(parseInt(squares[i+j].innerHTML));
    //         }
    //         for(let j=size-1;j>=0;j--){
    //             rotatedSquares.push(row[j])
    //         }
    //     }
    //     for(let i=0;i<size*size;i++){
    //         squares[i].innerHTML=rotatedSquares[i];
    //     }
    // }

    //swipe up
    // function swipeUp(){
    //     rotateLeft()
    //     swipeLeft()
    //     rotateRight()
    // }

    // //swipe down
    // function swipeDown(){
    //     rotateRight()
    //     swipeLeft()
    //     rotateLeft()
    // }