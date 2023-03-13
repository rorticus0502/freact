import initImage from './init-det.jpg';
import axios from 'axios';
import ZoomPanel from './ZoomPanel';

const GeneratorPanel = ({zooms, handleMouseDown, handleMouseRelease, zoom, reloadZoom, display}) => {

    return (

        <div id="mandelbrot-wrapper">
            <div id="fractal-wrapper">
                <img src={display} className='fractal-display' onMouseDown={handleMouseDown} onMouseUp={handleMouseRelease} />
            </div>
            {zooms.length > 0 && <ZoomPanel zooms={zooms} reload={reloadZoom} />}
        </div>
    );
};

export default GeneratorPanel;