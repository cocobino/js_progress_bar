(() => {
    document.querySelector('#range').addEventListener('input', e => {
        const value = e.target.value;
        const $progress = document.querySelector('#progress');

        $progress['style']['background'] ='#5d7be9';
        $progress['style']['border-radius'] = '8px 0 0 8px';
        $progress['style']['width'] = `${value}%`;
    });
})();