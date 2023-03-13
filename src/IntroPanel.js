import initImage from './init-det.jpg';

const IntroPanel = () => {

    return (
        <div id="intro-wrapper">
            <div id="intro-info-left" className="intro-info">
                <div>
                    This image was generated in the region;
                    <p>Real axis -0.199 to -0.191</p>
                    Imaginary axis 0.665 to 0.675
                </div>
            </div>
            <div>
                <img src={initImage} className='init-style' />
            </div>
            <div id="intro-info-right" className="intro-info">
                <div>
                    Zn = Z^2 + C
                </div>
            </div>
        </div>
    );
};

export default IntroPanel;