import * as _ from "fxjs";
import * as $ from "fxdom";
import { store } from '../store/index.js';

import { isSmoothScroll } from "@/store/appSettings.js";
import { stripHTMLlink, wrapLink } from "@/js/edit.js";
import { computed } from "@/helper/vue.js";
import { use } from "matter-js";

const getDiff = (p1, p2, offset = 0) => {
	return p1 - p2 - offset;
}

const isOverwrap = (p1, p2, offset = 0) => {
	return getDiff(p1, p2, offset) < 0 ? true : false;
}

const openPopup = (content) => {
  const popup = $.el(`
   <div class="c-layer">
		 <button class="c-layer__close-btn t-b--18">
      <span class="t--fak"> <span class="t--ft">(</span>CLOSE<span class="t--ft">)</span></span>
     </button>
     <div class="c-layer__pad">
      ${content}
     </div>
	 </div> 
  `);
  
  $.appendTo($.qs("body"), popup);
  $.qs(".c-layer__close-btn", popup).addEventListener("click", () => {
    $.remove(popup);
  });
};

const srcLoadProc = (item, tag, cb) => {
  return new Promise((resolve, reject) => {
    if(tag == "video") {
      if(item.readyState < 1) {
        // // onloadedmetadata 콜백 안타는 이유 확인(lambda랑 관련있을듯...)
        // return resolve(item.src);
        item.onloadedmetadata = () => {
          cb();
          return resolve(item.src);
        }
        item.onerror = () => {
          console.log("load error: ", item.src);
          return resolve(item.src);
        }
      }
      else {
        cb();
        return resolve(item.src);
      }
    }
    else {
      if(!item.complete) {
        item.onload = () => {
          cb();
          return resolve(item.src);
        }
        item.onerror = () => {
          console.log("load error: ", item.src);
          return resolve(item.src);
        }
      }
      else {
        // console.log("1. src: ", item.src);
        cb();
        resolve(item.src);
      }
    }
    
  });
};

const generateKey = (val) => {
	return `${val}_${ new Date().getTime() }`;
};

const getRelativePos = (parent, target) => {
	const relativeX = target.getBoundingClientRect().left - parent.getBoundingClientRect().left;
	const relativeY = target.getBoundingClientRect().top - parent.getBoundingClientRect().top;

	return {x: relativeX, y: relativeY};
}

const getDate = (d) => {
  const newDate = d.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
  
  const [ year, month, date ] = newDate.split('/')
  
  return { year: year, month: month, day: date }
}

const isURL = (url) => {
  const urlVali = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  return urlVali.test(url)

  // return true
}

const wrapWithTag = (val, splitWith, tag, Klass, checkLink = true) => {
  if(val == undefined) return "";

  checkLink ? val = wrapLink(val) : val;
  return _.go(
    val,
    (val) => {
      return val.replace(/\u00A0/gi, " ")
    },
    _.split(splitWith),
    _.compact,
    _.map(item => `<${tag} class="${Klass}">${item}</${tag}>`),
    _.join("")
  );
};

const stripHTML = (val, joinWith, checkLink = true) => {
  if(val == undefined) return "";
  checkLink ? val = stripHTMLlink(val) : val;

  return _.go(
    val,
    $.els,
    _.map(el => $.text(el)),
    _.join(joinWith),
  );
};

const formatNum = (id) => {
  let val = id.toString();
  while (val.length < 4) {
    val = '0' + val;
  }
  return val;
}

const formatYear = (y) => {
  let splitVal = typeof y === String ? y.split('') : y.toString().split('');
  splitVal[1] = 'K';

  return splitVal.join('');
}

const formatDate = (d) => {
  const splitVal = d.toString().split('');
  let year = splitVal.slice(0, 4).join('');
  let month = splitVal.slice(4, 6).join('');
  let day = splitVal.slice(6, 8).join('');

  year = formatYear(year);

  switch (month) {
    case '01':
      month = 'January';
      break;
    case '02':
      month = 'February';
      break;
    case '03':
      month = 'March';
      break;
    case '04':
      month = 'April';
      break;
    case '05':
      month = 'May';
      break;
    case '06':
      month = 'June';
      break;
    case '07':
      month = 'July';
      break;
    case '08':
      month = 'August';
      break;
    case '09':
      month = 'September';
      break;
    case '10':
      month = 'October';
      break;
    case '11':
      month = 'November';
      break;
    case '12':
      month = 'December';
      break;
    default:
      month = '';
  }

  day = day.replace(/(^0+)/, '');

  return `${day} ${month}, ${year}`;
}

const getToday = () => {
  Date.prototype.yyyymmdd = function() {
    const mm = this.getMonth() + 1; // getMonth() is zero-based
    const dd = this.getDate();
    return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
  };

  const date = new Date();
  return parseInt(date.yyyymmdd());
}

const formatTime = () => {
  const getDate = getToday().toString().split('')
  getDate.splice(4, 0, '-')
  getDate.splice(7, 0, '-')
  const date = getDate.join('')
  var d = new Date();
  var time = d.toLocaleTimeString(('it-IT'));
  
  return `${date} ${time}`
}

const getCurrentTime = () => {
  const newDate = new Date();

  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const date = newDate.getDate();
  const day = newDate.getDay();
  const hours = newDate.getHours();
  const seconds = newDate.getSeconds()
  const minutes = newDate.getMinutes();

  const weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return { year: year, month: month, date: date, day: day, hours: hours, minutes: minutes, seconds, getWeek: weekList[day], getMonth: monthList[month] }
}

const moveElement = () => {
  let objs = $.qsa("[data-swap]");
  let target, type;
  _.go(objs,
    _.each((obj) => {
      const swapData = _.split('|', obj.dataset.swap);

      if (store.state.currMq == 1) {
        target = $.qs(swapData[0]);
        type = swapData[1];
      } else if (store.state.currMq == -1 || store.state.currMq == 2) {
        target = $.qs(swapData[2]);
        type = swapData[3];
      } else if (store.state.currMq == 3) {
        if (swapData[4]) {
          target = $.qs(swapData[4]);
          type = swapData[5];
        } else {
          target = $.qs(swapData[2]);
          type = swapData[3];
        }
      }
      target[type](obj)
    })
  )
};

const getScroll = () => isSmoothScroll ? -document.querySelector(".i-canvas").getBoundingClientRect().y : window.pageYOffset;

const getPinnedScroll = (pinedPoint = 0) => {
  const currScroll = getScroll();
  if(pinedPoint < currScroll) {
    return currScroll - pinedPoint;
  }
  else {
    return 0;
  }
};

const stPos = (e, targetOrigin, screenOrigin, offset = 0) => {
	const target = e.trigger;
  const rect = target.getBoundingClientRect();
	const screenPoint = document.querySelector(".i-viewport").offsetHeight * screenOrigin;
	const targetPoint = (target.offsetHeight * targetOrigin) + rect.top + getScroll();
  // console.log("val - ", document.querySelector(".i-viewport").offsetHeight * screenOrigin);
  // console.log("target.offsetTop - ", target);
  // console.log("targetPoint - screenPoint - ", targetPoint - screenPoint);
  // console.log("targetPoint - screenPoint - ", targetPoint - screenPoint);
	return targetPoint - screenPoint + offset;
};

// 1.
// const stParallaxStart = (e, offset) => {
// 	const target = e.trigger;
//   const rect = target.getBoundingClientRect();
// 	const screenPoint = document.querySelector(".i-viewport").offsetHeight;
// 	const targetPoint = rect.top + getScroll();
//   console.log("getScroll ----- ", getScroll());
//   console.log("start--------------", targetPoint - screenPoint - offset);
//   return targetPoint - screenPoint - offset;
// };

// const stParallaxEnd = (e, offset) => {
// 	const target = e.trigger;
//   const rect = target.getBoundingClientRect();
// 	const targetPoint = target.offsetHeight + rect.top + getScroll();
//   console.log("end--------------", targetPoint - offset);
// 	return targetPoint - offset;
// };

// 2.
const stParallaxStart = (e, offset) => {
	const target = e.trigger;
  const rect = target.getBoundingClientRect();
	const screenPoint = document.querySelector(".i-viewport").offsetHeight;
	const targetPoint = rect.top + getScroll();
  // console.log("getScroll ----- ", getScroll());
  // console.log("start--------------", targetPoint - screenPoint - offset);
  return targetPoint - screenPoint - offset;
};

const stParallaxEnd = (e, offset) => {
	const target = e.trigger;
  const rect = target.getBoundingClientRect();
	const targetPoint = target.offsetHeight + rect.top + getScroll();
  // console.log("end--------------", targetPoint - offset);
	return targetPoint - offset;
};

const getRandomPick = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const sample = (arr, count = 1) => {
  let indexArr = _.range(arr.length);
  return _.go(
    _.range(count),
    _.map( _ => {
      let pickedIndex = getRandomPick(indexArr);
      indexArr.splice(indexArr.indexOf(pickedIndex), 1);
      return arr[pickedIndex];
    }),
  );
};

const getExtension = filename => filename.split('.').pop();

const clamp = (val, min, max) => val < min ? min : val > max ? max : val;

const normalize = (val, min, max) => (clamp(val, min, max) - min) / (max - min);

const easing = (t, name) => {
  let easingValue = name || 'linear'

  switch(name) {
    case 'linear': 
      easingValue = t; break;
    case 'easeInQuad': 
      easingValue = t*t; break;
    case 'easeOutQuad': 
      easingValue = t*(2-t); break;
    case 'easeInOutQuad': 
      easingValue = t<.5 ? 2*t*t : -1+(4-2*t)*t; break;
    case 'easeInCubic': 
      easingValue = t*t*t; break;
    case 'easeOutCubic': 
      easingValue = (--t)*t*t+1; break;
    case 'easeInOutCubic': 
      easingValue = t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; break;
    case 'easeInQuart': 
      easingValue = t*t*t*t; break;
    case 'easeOutQuart': 
      easingValue = 1-(--t)*t*t*t; break;
    case 'easeInOutQuart': 
      easingValue = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; break;
    case 'easeInQuint': 
      easingValue = t*t*t*t*t; break;
    case 'easeOutQuint': 
      easingValue = 1+(--t)*t*t*t*t; break;
    case 'easeInOutQuint': 
      easingValue = t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; break;
    case 'easeInCirc':
      easingValue = 1 - Math.sqrt(1 - Math.pow(t, 2)); break;
    case 'easeOutCirc':
      easingValue = Math.sqrt(1 - Math.pow(t - 1, 2)); break;
    case 'easeInOutCirc':
      easingValue = t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2; break;
  }
  return easingValue;
}

export {
  getDiff,
  isOverwrap,
  getRelativePos,
  getDate,
  isURL,
  wrapWithTag,
  stripHTML,
  formatNum,
  formatYear,
  formatDate,
  getToday,
  formatTime,
  getCurrentTime,
  stPos,
  stParallaxStart,
  stParallaxEnd,
  moveElement,
  getScroll,
  getPinnedScroll,
  clamp,
  normalize,
  easing,
  srcLoadProc,
  openPopup,
  getExtension,
  sample,
  generateKey
};