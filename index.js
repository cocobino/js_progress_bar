const RangeBar = (() => {
    let element, move = false, opt, rangeToMap = {};

    const template = (() => {
        let progress = () => {
            let t ='', drawWidth = (Number(opt['value'])/Number(opt['attribute']['max'])) * Number(opt['width']);
            t += `<div class="progress ${opt['type']==='manipulate' ? 'thumb' : ''}" data-id="${opt['name']}:progress" data-divider="false" data-name="${opt['name']}" data-key="${opt['key']}" data-type="${opt['type']}" style="width: ${`${drawWidth < 14 ? 14 : drawWidth}px`}; background: ${opt['type']==='result'&& opt['value'] === 100 ? '#5e7cea' : '#5aa9eb'};">`;
            for(let i=0; i<4; i++) {
                t+= `<div class="divider d${i+1}" data-key="${opt['key']}" data-divider="true" style="left:${(i+1)*53+1}px; display: ${(i+1)*53+1 < drawWidth ? 'block' : 'none'};"></div>`;
            }
            t+= '</div>';

            return t;
        };

        let progressBg = () => {
            let t=`<div class="progress_bg" data-name="${opt['name']}" data-key="${opt['key']}" data-divider="false">`;
            for(let i=0; i<4; i++) {
                t += `<div class="divider d${i+1}" data-name="${opt['name']}" data-divider="true" data-key="${opt['key']}" style="left:${(i+1)*53+1}px;"></div>`;
            }
            t += '</div>';

            return t;
        };

        let input = () => {
            return `
            <div class="input_area">
                <input type="text" value="${opt['value']}" data-name="${opt['name']}" data-key="${opt['key']}" name="${opt['name']}" data-max="${opt['attribute']['max']}" data-name="${opt['name']}"/>
            </div>`;
        };


        return function() {
            return `
            <div class="range_bar">
                <div class="progress_area" data-id="range" data-range="${opt.name}" data-key="${opt['key']}" data-name="${opt['name']}" data-divider="false" style="${opt.type==='manipulate' ? 'cursor: pointer;' : ''}">
                    ${progress()}
                    ${progressBg()}
                </div>
                    ${opt.textArea ? input() : ''}
            </div>
            `;
        };
    })();

    const event = () => {
        let offset = 0;
        // offsetX
        let getDividerOffsetX = (target) => {
            let offsetX = 0;
            new Array(...target.classList).forEach(list => {
                switch (list) {
                    case 'd1' : offsetX = (target.style.left.split('px')[0]); break;
                    case 'd2' : offsetX = (target.style.left.split('px')[0]); break;
                    case 'd3' : offsetX = (target.style.left.split('px')[0]); break;
                    case 'd4' : offsetX = (target.style.left.split('px')[0]); break;
                }
            });

            return Number(offsetX);
        };
        //drawResult
        let setResultStyle = (DOMresult, DOMresultTxt, DOMchecked, rstValue, calcResultWidth) => {
            if(rstValue < 100) {
                DOMresult['style']['background'] = rangeToMap[DOMresult['dataset']['name']]['color']['progress'];
                DOMresult.childNodes.forEach(DOM => DOM['style']['background'] = rangeToMap[DOMresult['dataset']['name']]['color']['divider']);
                DOMresultTxt['style']['color'] = rangeToMap[DOMresult['dataset']['name']]['color']['progress'];
                DOMchecked['classList'] = ['ing'];

                DOMresult['style']['width'] = `${calcResultWidth > 265 ? 265 : calcResultWidth}px`;
            } else if(rstValue === 100) {
                DOMresult['style']['background'] = rangeToMap[DOMresult['dataset']['name']]['color']['fullprogress'];
                DOMresult.childNodes.forEach(DOM => DOM['style']['background'] = rangeToMap[DOMresult['dataset']['name']]['color']['fulldivider']);
                DOMresultTxt['style']['color'] = rangeToMap[DOMresult['dataset']['name']]['color']['fullprogress'];
                DOMchecked['classList'] = ['full'];

                DOMresult['style']['width'] = `${calcResultWidth > 265 ? 265 : calcResultWidth}px`;
            } else {
                DOMresult['style']['background'] = rangeToMap[DOMresult['dataset']['name']]['color']['overprogress'];
                DOMresult.childNodes.forEach(DOM => DOM['style']['background'] = rangeToMap[DOMresult['dataset']['name']]['color']['overdivider']);
                DOMresultTxt['style']['color'] = rangeToMap[DOMresult['dataset']['name']]['color']['overprogress'];
                DOMchecked['classList'] = ['over'];

                DOMresult['style']['width'] = `${calcResultWidth > 265 ? 265 : calcResultWidth}px`;
            }
        };

        let mouseEvt = (e) => {
            const name =e.currentTarget.dataset.name;
            const key = e.currentTarget.dataset.key;
            const DOMprogress = document.querySelector(`[data-id="${name}:progress"]`);
            const DOMresult = document.querySelector(`[data-key="${rangeToMap[name]['key']}"][data-type="result"]`);
            const DOMresultTxt = document.querySelector(`[data-rangeresult="${rangeToMap[name]['key']}"]`);
            const DOMchecked = document.querySelector(`[data-id="${rangeToMap[name]['key']}:bg"]`);


            move = true; let curwidth=0, changeWidth=0;
            if(D.bool(e.target.dataset.divider)) {
                changeWidth = getDividerOffsetX(e.target);
            } else {
                offset = e.offsetX;
                curwidth = Number(DOMprogress.style.width.split('px')[0]) || 0;
                changeWidth = offset < e.offsetX ? (curwidth > rangeToMap[name]['attribute']['width'] ? curwidth = rangeToMap[name]['attribute']['width'] : curwidth += e.offsetX - offset) : (offset === e.offsetX ? offset : curwidth -= offset - e.offsetX);
            }
            DOMprogress.style.width = `${changeWidth}px`;
            DOMprogress.querySelectorAll('div.progress > div.divider').forEach(DOM => {
                DOM['style']['display'] = Number(DOM.style.left.split('px')[0]) < changeWidth ? 'block' : 'none';
            });

            (changeWidth > rangeToMap[name]['width']) ? DOMprogress.style.width = `${rangeToMap[name]['attribute']['width']}px` : DOMprogress.style.width = `${changeWidth < 5 ? 0 : changeWidth}px`;

            // input
            const calcValue = Math.floor((rangeToMap[name]['attribute']['max'] / rangeToMap[name]['width']) * changeWidth);
            document.querySelector(`input[name="${name}"]`).value = calcValue > rangeToMap[name]['attribute']['max'] ? rangeToMap[name]['attribute']['max'] : (calcValue === 0 ? 1 : calcValue);
            rangeToMap[name]['value'] = calcValue > rangeToMap[name]['attribute']['max'] ? rangeToMap[name]['attribute']['max'] : (calcValue === 0 ? 1 : calcValue);

            // result
            let rstValue = 0;
            document.querySelectorAll(`input[data-key="${rangeToMap[name]['key']}"]`).forEach(DOM => rstValue += Number(DOM.value));
            DOMresult.querySelectorAll('div.progress > div.divider').forEach(DOM => {
                DOM['style']['display'] = Number(DOM.style.left.split('px')[0]) < (rstValue / 100) * rangeToMap[name]['width'] ? 'block' : 'none';
            });
            rangeToMap[key]['value'] = rstValue;
            DOMresultTxt.innerHTML = `${rstValue}%`;

            let calcResultWidth = Math.floor((rstValue / 100) * rangeToMap[name]['width']);
            setResultStyle(DOMresult, DOMresultTxt, DOMchecked, rstValue, calcResultWidth);
        };
        //click
        element.querySelector(`[data-range=${rangeToMap[opt['name']]['name']}]`).addEventListener('mousedown', e => mouseEvt(e));
        //drag
        element.querySelector(`[data-range=${rangeToMap[opt['name']]['name']}]`).addEventListener('mousemove', e => { if(move) mouseEvt(e); });

        element.querySelector(`[data-range=${rangeToMap[opt['name']]['name']}]`).addEventListener('mouseup', e => move = false);

        element.querySelector(`[data-range=${rangeToMap[opt['name']]['name']}]`).addEventListener('mouseleave', e => move = false);
        //keyboard
        element.querySelector(`input[name="${rangeToMap[opt['name']]['name']}"]`).addEventListener('keydown', e => { if(e.keyCode===13) e.preventDefault(); });
        element.querySelector(`input[name="${rangeToMap[opt['name']]['name']}"]`).addEventListener('keyup', e => {
            let reg =/^[0-9]+$/;
            if(!reg.test(e.target.value)) return false;
            if(Number(e.target.value) > Number(e.target.dataset.max)) e.target.value = Number(e.target.dataset.max);
            if(Number(e.target.value) < 1) e.target.value = 1;

            const name = e.currentTarget.dataset.name;
            const key = e.currentTarget.dataset.key;

            const DOMresult = document.querySelector(`[data-key="${rangeToMap[name]['key']}"][data-type="result"]`);
            const changeWidth = (Number(e.target.value) / rangeToMap[name]['attribute']['max']) * rangeToMap[name]['width'];
            const DOMresultTxt = document.querySelector(`[data-rangeresult="${rangeToMap[name]['key']}"]`);
            const DOMchecked = document.querySelector(`[data-id="${rangeToMap[name]['key']}:bg"]`);

            document.querySelector(`[data-id="${name}:progress"]`).style.width = `${changeWidth}px`;

            document.querySelectorAll(`[data-id="${name}:progress"] > div.divider`).forEach(DOM => {
                DOM['style']['display'] = Number(DOM.style.left.split('px')[0]) < changeWidth ? 'block' : 'none';
            });
            rangeToMap[name]['value'] = e.target.value > rangeToMap[name]['attribute']['max'] ? rangeToMap[name]['attribute']['max'] : (e.target.value === 0 ? 1 : e.target.value);
            let rstValue = 0;
            document.querySelectorAll(`input[data-key="${rangeToMap[name]['key']}"]`).forEach(DOM => rstValue += Number(DOM.value));
            DOMresult.querySelectorAll('div.progress > div.divider').forEach(DOM => {
                DOM['style']['display'] = Number(DOM.style.left.split('px')[0]) < (rstValue / rangeToMap[name]['attribute']['max']) * rangeToMap[name]['width'] ? 'block' : 'none';
            });

            DOMresultTxt.innerHTML = `${rstValue}%`;
            rangeToMap[key]['value'] = rstValue;

            let calcResultWidth = Math.floor((rstValue / 100) * rangeToMap[name]['width']);
            setResultStyle(DOMresult, DOMresultTxt, DOMchecked, rstValue, calcResultWidth);
        });
    };

    const init = () => {
        element = document.createElement('div');
        element.innerHTML = template();
        if(opt.type === 'manipulate') event();
    };

    const setData = (option) => {
        opt = option;
        rangeToMap[opt.name] = opt;
        init();

        return element;
    };

    const getData = () => rangeToMap;

    return {
        element,
        setData,
        getData
    };
})();