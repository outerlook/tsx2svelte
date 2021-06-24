<!-- MaisDuvidas.svelte -->
<script lang="ts">
    import {PATH_AJUDA, PATH_FALE_CONOSCO} from "routeLinks";
    import tw from "twin.macro";
    import {Atendimento} from "../../ui/atomos/ilustracoes/multicolor/Atendimento.svelte";
    import {BotaoNavigateTo} from "../../ui/atomos/links/BotaoNavigateTo.svelte";
    import {trackId} from "../../utils/gtmHelpers/idTrack";
    import {MediaRender} from "../../utils/mediaHelpers";
</script>

<div tw={"mx-auto"} id={trackId('mais-duvidas')}>
    <MediaRender tipo={"md-"}>
        <Typo.H2 style={tw`mt-l mb-m text-center`}>Restou alguma dúvida?</Typo.H2>
    </MediaRender>
    <div class="wrapper">
        <Atendimento />
        <div tw={"py-m lg:py-xl"}>
            <MediaRender tipo={"lg"}>
                <Typo.H2>Restou alguma dúvida?</Typo.H2>
            </MediaRender>
            <BotaoNavigateTo label={"Visite nossa central de ajuda"} to={PATH_AJUDA} payload={{}} />
            <BotaoNavigateTo label={"Entre em contato com a gente"} to={PATH_FALE_CONOSCO} payload={{}} />
        </div>
    </div>
</div>

<style lang="scss">
    .wrapper {
      > svg {
        max-height: 300px;
        min-width: 150px;
        max-width: min-content;
      }

      @apply px-m space-x-m md:(space-x-xl) lg:pt-xl pb-xl bg-branco-0 relative flex justify-center;
    }
</style>