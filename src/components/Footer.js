import React from 'react';

function Footer() {
    const footerStyle = {
        position: 'fixed',
        bottom: '0%',
        color: '#aaaaaa'
    };

    return(
        <div style={footerStyle}>
            <small>&copy; 2021 Test-Ware.com. </small>
            <small>This website is provided for entertainment use only. No information constitutes financial advice. Performance scores in this simulation may not reflect potential performance in real markets.</small>
            <small>Financial market conditions change constently and risk is high. Please consult professional financial advisors before trading in the real markets.</small>
        </div>
    );
}

export { Footer };