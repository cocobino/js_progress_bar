const RangeBar = (()=> {
    let rangeToMap, element;

    //Range data
    rangeToMap = {};

        
        const validation = (() => {
            const type = ['manipulate', 'result'];
            // const attri

            return function(opt) {
                type.indexOf(opt.type) === -1 ? new Error('type 명을 확인해주세요.') : '';
            };
        })();
    
        const template = (() => {
        //  선택영역 divider
            function selectRange() {
                let t= '';
                for(let i=0; i<opt.divider-1; i++) t+=`<div class="divider" style="left: ${((opt.width/opt.divider)*(i+1))+(i+1)}px; background:${opt['color']['divider']}"></div>`;
                return t;
            }
        //  배경
            function background() {
                let t ='';
                for(let i=0; i<opt.divider; i++) t+= `<div class="progress_bar_bg" style="border-radius:${i===0 ? '8px 0 0 8px' : i===opt.divider-1 ? '0 8px 8px 0' : ''}"></div>`;
                return t;
            }
        // 진행바
            function range() {
                return `<div class="progress_bar_range">
                            <input type="range" class="${opt.type}" value="${opt.value}" data-name="${opt.name}" data-id="${opt.name}:range" data-type="${opt.type}" data-target="${opt.name}" data-key="${opt.key}" name="${opt.name}" step="${opt['attribute']['step'] ? opt['attribute']['step'] : ''}" min="${opt['attribute']['min'] ? opt['attribute']['min'] : ''}" max="${opt['attribute']['max'] ? opt['attribute']['max'] : ''}"/>
                            ${opt.textArea ? `<input type="text" data-target="${opt.name}" data-name="${opt.name}" data-id="${opt.name}:rangeTxt" value=${opt.value ? opt.value : ''} data-key="${opt.key}Txt" name="${opt.name}Txt"/>` : ''}
                        </div>`
            }
        //  default
            function setRange() {
                return `background: ${opt['color']['progress']}; border-radius:8px; width: ${opt.value ? (Number(opt.value) >= 100 ? 100 : opt.value)  : 0}%`;
            }

            return function() {
                return `<div class="progress_bar_warpper" data-range-key="${opt.key}" style="width:${opt.textArea ? Number(opt.width.split('px')[0])+40 : Number(opt.width.split('px')[0])}px;">
                            <div class="progress_bar_bgArea">
                                <div data-id="${opt.name}:progress" class="progress" data-type="${opt.type}" data-key="${opt.key}" style="${setRange()}">
                                ${selectRange()}
                                </div>
                                ${background()}
                            </div>
                            ${range()}
                        </div>`;
            };
        })();

        function event() {
            const cssUtil = (DOM, bg, width) => {
                DOM['style']['background'] =bg;
                DOM['style']['border-radius'] ='8px 0 0 8px';
                DOM['style']['width'] =`${width}%`;
            };
            // rangeBar
            element.querySelector(`input[data-id="${opt.name}:range"]`).addEventListener('input', e => { 
                const value = e.target.value;
                const target =  e.target.dataset.target;
                const type = e.target.dataset.type;
                const DOMprogress = document.querySelector(`div[data-id="${target}:progress"]`);
                const DOMinput = document.querySelector(`input[data-id="${target}:rangeTxt"]`);
                
                cssUtil(DOMprogress, rangeToMap[e.target.dataset.name]['color']['progress'], value);
                DOMinput.value = value;

                if(type === 'manipulate') {
                    let resultValue=0;
                    document.querySelectorAll(`input[data-key="${opt.key}"][data-type="${type}"]`).forEach(DOM => {
                        resultValue += Number(DOM.value) 
                    });
                    document.querySelector(`input[data-key="${opt.key}"][data-type="result"]`).value = resultValue;
                    document.querySelector(`div[data-type="result"][data-key=${e.target.dataset.key}]`)['style']['width'] =`${resultValue}%`;        
                }
            });

            // inputTxt
            if(opt.textArea) {
                element.querySelector(`input[data-id="${opt.name}:rangeTxt"]`).addEventListener('keyup', e => {
                    const value = e.target.value;
                    const target = e.target.dataset.target;
                    const DOMprogress = $(`div[data-id="${target}:progress"]`);
                    const DOMrange = $(`input[data-id="${target}:range"]`);
    
                    cssUtil(DOMprogress, rangeToMap[e.target.dataset.name]['color']['progress'],value);
                    DOMrange.value = value;
                });
            }
        };

        const setData = (option) => {
            rangeToMap[option.name] = opt = {...option};
            element = document.createElement('div');
            element.innerHTML = template();
            element = element.firstChild;
            
            event();
            return element;
        };

        const getData = () => {

        };
        
        return {
            element,
            setData,
            getData
        }
    
})();
