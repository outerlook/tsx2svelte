import React from "react";
import { PATH_AJUDA, PATH_FALE_CONOSCO } from "routeLinks";
import tw, { styled } from "twin.macro";
import { Typo } from "ui/ions/Tipografia";
import { Atendimento } from "../../ui/atomos/ilustracoes/multicolor/Atendimento";
import { BotaoNavigateTo } from "../../ui/atomos/links/BotaoNavigateTo";
import { trackId } from "../../utils/gtmHelpers/idTrack";
import { MediaRender } from "../../utils/mediaHelpers";

const Wrapper = styled.div`
  > svg {
    max-height: 300px;
    min-width: 150px;
    max-width: min-content;
  }

  ${tw`px-m space-x-m md:(space-x-xl) lg:pt-xl pb-xl bg-branco-0 relative flex justify-center`};
`;

export const MaisDuvidas = () => (
  <div tw={"mx-auto"} id={trackId("mais-duvidas")}>
    <MediaRender tipo={"md-"}>
      <Typo.H2 style={tw`mt-l mb-m text-center`}>Restou alguma dúvida?</Typo.H2>
    </MediaRender>
    <Wrapper>
      <Atendimento />
      <div tw={"py-m lg:py-xl"}>
        <MediaRender tipo={"lg"}>
          <Typo.H2>Restou alguma dúvida?</Typo.H2>
        </MediaRender>
        <BotaoNavigateTo
          label={"Visite nossa central de ajuda"}
          to={PATH_AJUDA}
          payload={{}}
        />
        <BotaoNavigateTo
          label={"Entre em contato com a gente"}
          to={PATH_FALE_CONOSCO}
          payload={{}}
        />
      </div>
    </Wrapper>
  </div>
);

export const MaisDuvidas = () => (
  <div tw={"mx-auto"} id={trackId("mais-duvidas")}>
    <MediaRender tipo={"md-"}>
      <Typo.H2 style={tw`mt-l mb-m text-center`}>Restou alguma dúvida?</Typo.H2>
    </MediaRender>
    <Wrapper>
      <Atendimento />
      <div tw={"py-m lg:py-xl"}>
        <MediaRender tipo={"lg"}>
          <Typo.H2>Restou alguma dúvida?</Typo.H2>
        </MediaRender>
        <BotaoNavigateTo
          label={"Visite nossa central de ajuda"}
          to={PATH_AJUDA}
          payload={{}}
        />
        <BotaoNavigateTo
          label={"Entre em contato com a gente"}
          to={PATH_FALE_CONOSCO}
          payload={{}}
        />
      </div>
    </Wrapper>
  </div>
);

export const MaisDuvidas = () => {
  return (
    <div tw={"mx-auto"} id={trackId("mais-duvidas")}>
      <MediaRender tipo={"md-"}>
        <Typo.H2 style={tw`mt-l mb-m text-center`}>
          Restou alguma dúvida?
        </Typo.H2>
      </MediaRender>
      <Wrapper>
        <Atendimento />
        <div tw={"py-m lg:py-xl"}>
          <MediaRender tipo={"lg"}>
            <Typo.H2>Restou alguma dúvida?</Typo.H2>
          </MediaRender>
          <BotaoNavigateTo
            label={"Visite nossa central de ajuda"}
            to={PATH_AJUDA}
            payload={{}}
          />
          <BotaoNavigateTo
            label={"Entre em contato com a gente"}
            to={PATH_FALE_CONOSCO}
            payload={{}}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export const MaisDuvidas1 = () => {
  return (
    <div tw={"mx-auto"} id={trackId("mais-duvidas")}>
      <MediaRender tipo={"md-"}>
        <Typo.H2 style={tw`mt-l mb-m text-center`}>
          Restou alguma dúvida?
        </Typo.H2>
      </MediaRender>
      <Wrapper>
        <Atendimento />
        <div tw={"py-m lg:py-xl"}>
          <MediaRender tipo={"lg"}>
            <Typo.H2>Restou alguma dúvida?</Typo.H2>
          </MediaRender>
          <BotaoNavigateTo
            label={"Visite nossa central de ajuda"}
            to={PATH_AJUDA}
            payload={{}}
          />
          <BotaoNavigateTo
            label={"Entre em contato com a gente"}
            to={PATH_FALE_CONOSCO}
            payload={{}}
          />
        </div>
      </Wrapper>
    </div>
  );
};

function MaisDuvidas2() {
  return (
    <div tw={"mx-auto"} id={trackId("mais-duvidas")}>
      <MediaRender tipo={"md-"}>
        <Typo.H2 style={tw`mt-l mb-m text-center`}>
          Restou alguma dúvida?
        </Typo.H2>
      </MediaRender>
      <Wrapper>
        <Atendimento />
        <div tw={"py-m lg:py-xl"}>
          <MediaRender tipo={"lg"}>
            <Typo.H2>Restou alguma dúvida?</Typo.H2>
          </MediaRender>
          <BotaoNavigateTo
            label={"Visite nossa central de ajuda"}
            to={PATH_AJUDA}
            payload={{}}
          />
          <BotaoNavigateTo
            label={"Entre em contato com a gente"}
            to={PATH_FALE_CONOSCO}
            payload={{}}
          />
        </div>
      </Wrapper>
    </div>
  );
}
