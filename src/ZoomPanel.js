const ZoomPanel = ({zooms, reload, download}) => {

    const zoomElements = zooms.map(zoom =>

        <div className="zoom-wrapper" key={zoom.index}>
            <div className="zoom-index">{zoom.index}.</div>
            <div className="zoom-card">
                <div className="zoom-card-header">
                    <button onClick={() => reload(zoom)}>reload</button>
                    <div className="zoom-card-name">{zoom.name}</div>
                    <button onClick={() => download(zoom)}>save</button>
                </div>
                <div className="zoom-card-real">{zoom.realMin} to {zoom.realMax}</div>
                <div className="zoom-card-imaginary">{zoom.imaginaryMin} to {zoom.imaginaryMax}</div>
            </div>
        </div>
    );

    return (

        <div id="zooms-panel-wrapper">
            <div id="zooms-panel">
                {zoomElements}
            </div>
        </div>
    );
};

export default ZoomPanel;