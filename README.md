### **League of Legends React HUD for [LHM.gg](http://LHM.gg)**

League of Legends React HUD for [LHM.gg](http://LHM.gg), created by Lexogrine, is an open source League of Legends HUD that you can use and modify to your needs. It’s the core element of building customized League of Legends HUDs and spectator overlays for the [LHM.gg](http://LHM.gg) platform.

It comes with a set of default options and features that you can use for creating your unique esport experience.

**Download**  
To download it, simply click here: [**DOWNLOAD League of Legends React HUD for LHM.gg**](https://lhm.gg/download?target=lol)

#### **Instruction**

##### **Setting up**

Fork this repo, clone it, and then run `npm install` and `npm start`. HUD should start on the 3500 port. For this to work, have [LHM.gg](http://LHM.gg) open so it will pass League of Legends data to the HUD.

**Identifying HUD**  
In `/public` directory, edit `hud.json` so it fits you \- fill HUD's name, author, version, specify the radar and killfeed functionalities. At the end, replace the `thumb.png` with your icon :)

##### **Building & distributing**

To build a version to distribute and move around, in the root directory, run `npm run pack`. It will create the zip file for distribution. Now you can just drag and drop this file into the [LHM.gg](http://LHM.gg) upload area.

##### **Signing**

To create Signed CS2 HUD for [LHM.gg](http://LHM.gg) to prevent at least from modifying compiled JavaScript files, run `npm run sign`. It's the same as `npm run pack` command but with an additional step of signing `.js` and `.css` files and `hud.json`.

##### **File structure**

The HUD is separated into two parts \- the API part, which connects to the [LHM.gg](http://LHM.gg) API and communicates with it: `src/App.tsx` file and `src/api` directory. Usually, you don't want to play with it, so the whole thing runs without a problem. The second part is the render part \- `src/HUD`, `src/fonts` and `src/assets` are the directories you want to modify. In the `src/HUD` each element of the HUD is separated into its own folder. Styles are kept in the `src/HUD/styles`. Names are quite self-explanatory, and to modify the style of the element, you should just find the styling by the file and class name.

**panel.json API**  
To get the incoming data from the LHM.gg, let's take a look at the `src/HUD/SideBoxes/SideBox.tsx` component:

```typescript
const Sidebox = ({ side, hide }: { side: "left" | "right"; hide: boolean }) => {
  const [image, setImage] = useState<string | null>(null);
  const data = useConfig("display_settings");

  useOnConfigChange(
    "display_settings",
    (data) => {
      if (data && `${side}_image` in data) {
        const imageUrl = `${apiUrl}api/huds/${
          hudIdentity.name || "dev"
        }/display_settings/${side}_image?isDev=${
          hudIdentity.isDev
        }&cache=${new Date().getTime()}`;
        setImage(imageUrl);
      }
    },
    []
  );

  if (!data || !data[`${side}_title`]) return null;
  return (
    <div className={`sidebox ${side} ${hide ? "hide" : ""}`}>
      <div className="title_container">
        <div className="title">{data[`${side}_title`]}</div>
        <div className="subtitle">{data[`${side}_subtitle`]}</div>
      </div>
      <div className="image_container">
        {image ? <img src={image} id={`image_left`} alt={"Left"} /> : null}
      </div>
    </div>
  );
};
```

You can just read data from the HUDs settings by using `useConfig` hook. Everything is now strictly typed. If you make a change to panel or keybinds JSON files, Vite server will automatically generate types for you, so useConfig should always be up to date.

If you want to listen for a change in settings, you can use `useOnConfigChange`. In this case we are using this to force refresh `src` attribute of the `img` element.

If you want to listen for action input, you can just use `useAction` hook, like here in `Trivia.tsx`:

```typescript
useAction("triviaState", (state) => {
  setShow(state === "show");
});
```

For the action input we need to import the `actions` object and create listener with the parameter on it.

**keybinds.json API**  
Keybinds API works in a very similar way to `panel.json` action API. This time, the example will be from `RadarMaps.tsx`:

```typescript
useAction(
  "radarBigger",
  () => {
    setRadarSize((p) => p + 10);
  },
  []
);

useAction(
  "radarSmaller",
  () => {
    setRadarSize((p) => p - 10);
  },
  []
);
```

**About Lexogrine**  
[Lexogrine](http://lexogrine.com) is an AI software development company, offering top-tier AI, web, and mobile design and development services for international companies. Alongside that, Lexogrine offers a set of web and mobile applications \- including [LHM.gg](http://LHM.gg) \- that revolutionize the way experts and specialists from different industries work together on a daily basis.

[Lexogrine](http://lexogrine.com) specializes in AI development, alongside web, mobile, and cloud development with technologies like TypeScript, Python, LLM, React, React Native, Node.js, Prisma, Medusa, Pytorch, AWS, and Google Cloud Platform.

With over 5 years of experience, Lexogrine delivered hundreds of projects, supporting companies and enterprises from all over the world.
