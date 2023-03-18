import ZoomPanel from './ZoomPanel';

const GeneratorPanel = ({
            zooms,
            display,
            handleMouseDown,
            handleMouseRelease,
            handleTouchStart,
            handleTouchEnd,
            reloadZoom
    }) => {


    return (

        <div id="mandelbrot-wrapper">
            <div id="fractal-wrapper">
                <img
                    src={display}
                    className='fractal-display'
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseRelease}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />
            </div>
            {zooms.length > 0 && <ZoomPanel zooms={zooms} reload={reloadZoom} />}
        </div>
    );
};

export default GeneratorPanel;