function svgLoaded(){
    console.log(arguments)
    let svgObj = document.querySelector("#svg-object")
        board = document.querySelector(".illustration")
        // board = document.querySelector(".illustration > div")
        svg = svgObj.contentDocument.childNodes[0]
        svgObj.remove();
        board.prepend(svg)
        svg.setAttribute("width", "100%")
        svg.setAttribute("height", "100%")
}


const span = document.querySelector('span')


const colorVars = ['--color-1','--color-2','--color-3','--ground','--sky'];

const fetchColors = async () => {
    var url = "http://colormind.io/api/";
    var data = {
        model: "default",
        // input: [[125, 74, 205],[239, 185, 37],[235, 99, 57],"N","N"]
    }
    const rawResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    const {result} = await rawResponse.json();
  
    console.log(result);

    let sky = rgbToHsl(result[4])
    let css = getCssString(result)+
    `--grey-dark:${darkenBy(result[4],14)};`+
    `--grey-light:${darkenBy(result[4],5)};`
    // `--grey-light: hsl(${Math.round(sky[0]*100)}, ${Math.round(sky[1]*100)}%, ${sky[1]*1.08}%);
    // --grey-dark: rgba(0, 0, 0, 0.17);`;

    document.body.style = css
    span?.remove()
}

const getCssColor = arr => `rgb(${arr.toString()})`
const getCssString= colors => colorVars.reduce((acc,val,i)=>acc+=`${val}:${getCssColor(colors[i])};`,'')

window.addEventListener('click',fetchColors)

function rgbToHsl([r, g, b]){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l*100];
}

function darkenBy(rgbIntArray,step=10) {
  
    // Our rgb to int array function again
    // const rgbIntArray = rgb.replace(/ /g, '').slice(4, -1).split(',').map(e => parseInt(e));
    //grab the values in order of magnitude 
    //this uses the function from the saturate function
    const [lowest,middle,highest]=getLowestMiddleHighest(rgbIntArray);
    
    if(highest.val===0){
      return rgb;
    }
  
    const returnArray = [];
  
    returnArray[highest.index] = highest.val-(Math.min(highest.val,2.55*step));
    const decreaseFraction  =(highest.val-returnArray[highest.index])/ (highest.val);
    returnArray[middle.index]= middle.val -middle.val*decreaseFraction; 
    returnArray[lowest.index]= lowest.val -lowest.val*decreaseFraction;              
                              
    // Convert the array back into an rgb string
    return (`rgb(${returnArray.join()}) `);
  }

function getLowestMiddleHighest(rgbIntArray) {
    let highest = {val:-1,index:-1};
    let lowest = {val:Infinity,index:-1};

    rgbIntArray.map((val,index)=>{
        if(val>highest.val){
            highest = {val:val,index:index};
        }
        if(val<lowest.val){
            lowest = {val:val,index:index};
        }
    });

    if(lowest.index===highest.index){
        lowest.index=highest.index+1;
    }

    let middle = {index: (3 - highest.index - lowest.index)};
    middle.val = rgbIntArray[middle.index];
    return [lowest,middle,highest];
}