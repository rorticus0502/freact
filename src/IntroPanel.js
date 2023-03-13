import initImage from './init-det.jpg';

const IntroPanel = () => {

    return (
        <div id="intro-wrapper">
            <div id="fractal-wrapper">
                <img src={initImage} className='init-style' />
            </div>
        </div>
    );
};

export default IntroPanel;