const RangeBar = (() => {
    let opt = {};

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
                            <input type="range" class="${opt.type}" value="${opt.value}" data-id="${opt.name}:range" data-type="${opt.type}" data-target="${opt.name}" data-key="${opt.key}" name="${opt.name}" step="${opt['attribute']['step'] ? opt['attribute']['step'] : ''}" min="${opt['attribute']['min'] ? opt['attribute']['min'] : ''}" max="${opt['attribute']['max'] ? opt['attribute']['max'] : ''}"/>
                            ${opt.textArea ? `<input type="text" data-target="${opt.name}" data-id="${opt.name}:rangeTxt" value=${opt.value ? opt.value : ''} data-key="${opt.key}Txt" name="${opt.name}Txt"/>` : ''}
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
            const cssUtil = ($target, bg, width) => {
                $target.css({
                    'background': bg,
                    'border-radius': '8px 0 0 8px',
                    'width' : `${width}%`
                });
            };
            const $doc =$(document);

            // rangeBar
            $doc.on('input', `input[data-id="${opt.name}:range"]`, e => {
                const value = e.target.value;
                const target =  e.target.dataset.target;
                const type = e.target.dataset.type;
                const $progress = $(`div[data-id="${target}:progress"]`);
                const $input = $(`input[data-id="${target}:rangeTxt"]`);
                
                cssUtil($progress, opt['color']['progess'],value);
                $input.val(value);

                if(type === 'manipulate') {
                    let resultValue=0;
                    $(`input[data-key="${opt.key}"][data-type="${type}"]`).each((i, $dom) => resultValue += Number($dom.value));
                    $(`input[data-key="${opt.key}"][data-type="result"]`).val(resultValue);
                    $(`div[data-type="result"][data-key=${e.target.dataset.key}]`).css('width', resultValue+'%');
                }
            });

            // inputTxt
            $doc.on('keyup', `input[data-id="${opt.name}:rangeTxt"]`, e => {
                const value = e.target.value;
                const target = e.target.dataset.target;
                const $range = $(`input[data-id="${target}:range"]`);
                const $progress = $(`div[data-id="${target}:progress"]`);

                cssUtil($progress, opt['color']['progess'],value);
                $range.val(value);
            });
        };

    return function(option) {
        opt = {...option};
        validation(opt);
        event();
        return {
            el:$(template()),
            template: template
        };
    }
    
})();
