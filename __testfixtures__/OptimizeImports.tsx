import React from "react";
import "react-image-crop/dist/ReactCrop.css";
import { styled } from "twin.macro";
import {b, c, e as d} from 'a'
import e, {x} from 's'
import * as _ from 'lodash'
import type {PropsB, PropsA, PropsC } from 'weiq'
import {PropsD} from 'weioqj'

const Wrapper = styled.div<PropsB>`
  > button {
    margin-left: auto;
  }
  .ReactCrop__image {
    max-width: 350px;
    max-height: 350px;
  }
  .ReactCrop__crop-selection {
    border-radius: 50%;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.8);
  }
`;

interface Props {
  imagem: string | null;
  fecha: () => void;
  outro: PropsA
}

const propsD: PropsD = 'a'


