import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ isChecked }) => {
  return (
    <StyledWrapper>
      <div>
        <input
          id="toggle-heart"
          type="checkbox"
          checked={isChecked} 
          readOnly 
        />
        <label
          htmlFor="toggle-heart"
          aria-label="like"
          className={isChecked ? "text-red-500" : "text-gray-500"} 
        >
          ❤
        </label>
      </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  [id='toggle-heart'] {
    display: none;
  }

  [id='toggle-heart']:checked + label {
    color: #e2264d;
    filter: none;
    will-change: font-size;
    animation: heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49);
  }

  [id='toggle-heart']:checked + label:before, [id='toggle-heart']:checked + label:after {
    animation: inherit;
    animation-timing-function: ease-out;
  }

  [id='toggle-heart']:checked + label:before {
    will-change: transform, border-width, border-color;
    animation-name: bubble;
  }

  [id='toggle-heart']:checked + label:after {
    will-change: opacity, box-shadow;
    animation-name: sparkles;
  }

  [id='toggle-heart']:focus + label {
    text-shadow: 0 0 3px white, 0 1px 1px white, 0 -1px 1px white, 1px 0 1px white, -1px 0 1px white;
  }

  [for='toggle-heart'] {
    align-self: center;
    position: relative;
    color: #888;
    font-size: 2em;
    filter: grayscale(1);
    user-select: none;
    cursor: pointer;
  }

  [for='toggle-heart']:before, [for='toggle-heart']:after {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    content: '';
  }

  [for='toggle-heart']:before {
    box-sizing: border-box;
    margin: -2.25rem;
    border: solid 2.25rem #e2264d;
    width: 4.5rem;
    height: 4.5rem;
    transform: scale(0);
  }

  [for='toggle-heart']:after {
    margin: -0.1875rem;
    width: 0.375rem;
    height: 0.375rem;
    box-shadow: 2.8125rem*cos(-90deg)0.375rem*cos(-30deg) 2.8125rem*sin(-90deg)0.375rem*sin(-30deg) 0 -0.1875rem #ff8080, 2.8125rem*cos(-90deg)0.375rem*cos(150deg) 2.8125rem*sin(-90deg)0.375rem*sin(150deg) 0 -0.1875rem #ffed80, 2.8125rem*cos(-38.5714285714deg)0.375rem*cos(21.4285714286deg) 2.8125rem*sin(-38.5714285714deg)0.375rem*sin(21.4285714286deg) 0 -0.1875rem #ffed80, 2.8125rem*cos(-38.5714285714deg)0.375rem*cos(201.4285714286deg) 2.8125rem*sin(-38.5714285714deg)0.375rem*sin(201.4285714286deg) 0 -0.1875rem #a4ff80, 2.8125rem*cos(12.8571428571deg)0.375rem*cos(72.8571428571deg) 2.8125rem*sin(12.8571428571deg)0.375rem*sin(72.8571428571deg) 0 -0.1875rem #a4ff80, 2.8125rem*cos(12.8571428571deg)0.375rem*cos(252.8571428571deg) 2.8125rem*sin(12.8571428571deg)0.375rem*sin(252.8571428571deg) 0 -0.1875rem #80ffc8, 2.8125rem*cos(64.2857142857deg)0.375rem*cos(124.2857142857deg) 2.8125rem*sin(64.2857142857deg)0.375rem*sin(124.2857142857deg) 0 -0.1875rem #80ffc8, 2.8125rem*cos(64.2857142857deg)0.375rem*cos(304.2857142857deg) 2.8125rem*sin(64.2857142857deg)0.375rem*sin(304.2857142857deg) 0 -0.1875rem #80c8ff, 2.8125rem*cos(115.7142857143deg)0.375rem*cos(175.7142857143deg) 2.8125rem*sin(115.7142857143deg)0.375rem*sin(175.7142857143deg) 0 -0.1875rem #80c8ff, 2.8125rem*cos(115.7142857143deg)0.375rem*cos(355.7142857143deg) 2.8125rem*sin(115.7142857143deg)0.375rem*sin(355.7142857143deg) 0 -0.1875rem #a480ff, 2.8125rem*cos(167.1428571429deg)0.375rem*cos(227.1428571429deg) 2.8125rem*sin(167.1428571429deg)0.375rem*sin(227.1428571429deg) 0 -0.1875rem #a480ff, 2.8125rem*cos(167.1428571429deg)0.375rem*cos(407.1428571429deg) 2.8125rem*sin(167.1428571429deg)0.375rem*sin(407.1428571429deg) 0 -0.1875rem #ff80ed, 2.8125rem*cos(218.5714285714deg)0.375rem*cos(278.5714285714deg) 2.8125rem*sin(218.5714285714deg)0.375rem*sin(278.5714285714deg) 0 -0.1875rem #ff80ed, 2.8125rem*cos(218.5714285714deg)0.375rem*cos(458.5714285714deg) 2.8125rem*sin(218.5714285714deg)0.375rem*sin(458.5714285714deg) 0 -0.1875rem #ff8080;
  }

  @keyframes heart {
  0%, 17.5% {
    font-size: 0;
    transform: scale(0);
  }
  40% {
    transform: scale(1.5);
  }
  60% {
    transform: scale(0.9);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}


  @keyframes bubble {
    15% {
      transform: scale(1);
      border-color: #cc8ef5;
      border-width: 2.25rem;
    }

    30%, 100% {
      transform: scale(1);
      border-color: #cc8ef5;
      border-width: 0;
    }
  }

  @keyframes sparkles {
    0%, 20% {
      opacity: 0;
    }

    25% {
      opacity: 1;
      box-shadow: 2.25rem*cos(-90deg)0.375rem*cos(-30deg) 2.25rem*sin(-90deg)0.375rem*sin(-30deg) 0 0rem #ff8080, 2.25rem*cos(-90deg)0.375rem*cos(150deg) 2.25rem*sin(-90deg)0.375rem*sin(150deg) 0 0rem #ffed80, 2.25rem*cos(-38.5714285714deg)0.375rem*cos(21.4285714286deg) 2.25rem*sin(-38.5714285714deg)0.375rem*sin(21.4285714286deg) 0 0rem #ffed80, 2.25rem*cos(-38.5714285714deg)0.375rem*cos(201.4285714286deg) 2.25rem*sin(-38.5714285714deg)0.375rem*sin(201.4285714286deg) 0 0rem #a4ff80, 2.25rem*cos(12.8571428571deg)0.375rem*cos(72.8571428571deg) 2.25rem*sin(12.8571428571deg)0.375rem*sin(72.8571428571deg) 0 0rem #a4ff80, 2.25rem*cos(12.8571428571deg)0.375rem*cos(252.8571428571deg) 2.25rem*sin(12.8571428571deg)0.375rem*sin(252.8571428571deg) 0 0rem #80ffc8, 2.25rem*cos(64.2857142857deg)0.375rem*cos(124.2857142857deg) 2.25rem*sin(64.2857142857deg)0.375rem*sin(124.2857142857deg) 0 0rem #80ffc8, 2.25rem*cos(64.2857142857deg)0.375rem*cos(304.2857142857deg) 2.25rem*sin(64.2857142857deg)0.375rem*sin(304.2857142857deg) 0 0rem #80c8ff, 2.25rem*cos(115.7142857143deg)0.375rem*cos(175.7142857143deg) 2.25rem*sin(115.7142857143deg)0.375rem*sin(175.7142857143deg) 0 0rem #80c8ff, 2.25rem*cos(115.7142857143deg)0.375rem*cos(355.7142857143deg) 2.25rem*sin(115.7142857143deg)0.375rem*sin(355.7142857143deg) 0 0rem #a480ff, 2.25rem*cos(167.1428571429deg)0.375rem*cos(227.1428571429deg) 2.25rem*sin(167.1428571429deg)0.375rem*sin(227.1428571429deg) 0 0rem #a480ff, 2.25rem*cos(167.1428571429deg)0.375rem*cos(407.1428571429deg) 2.25rem*sin(167.1428571429deg)0.375rem*sin(407.1428571429deg) 0 0rem #ff80ed, 2.25rem*cos(218.5714285714deg)0.375rem*cos(278.5714285714deg) 2.25rem*sin(218.5714285714deg)0.375rem*sin(278.5714285714deg) 0 0rem #ff80ed, 2.25rem*cos(218.5714285714deg)0.375rem*cos(458.5714285714deg) 2.25rem*sin(218.5714285714deg)0.375rem*sin(458.5714285714deg) 0 0rem #ff8080;
    }
  }`;

export default Checkbox;