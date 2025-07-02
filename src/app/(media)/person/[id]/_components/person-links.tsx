import { PersonExternalIdsResponse } from "@/types/request-types-camelcase";
import TmdbLogo from "@/assets/tmdb-logo.svg";
import ImdbLogo from "@/assets/IMDB_Logo_2016.svg";
import InstagramLogo from "@/assets/Instagram_logo_2022.svg"
import TikTokLogo from "@/assets/Tik_Tok.svg"
import YouTubeLogo from "@/assets/YouTube_full-color_icon_(2024).svg"
import XLogo from "@/assets/X_logo.svg"
import FacebookLogo from "@/assets/2023_Facebook_icon.svg"
import WikiDataLogo from "@/assets/Wikidata_logo_Spanish_vertical_in_colour.svg"
import WikipediaLogo from "@/assets/Wikipedia-logo-v2.svg"

const LABEL_OVERRIDES: Record<string, string> = {
  imdb: 'IMDb',
  wikidata: 'Wikidata',
  tvRage: 'TVRage',
  tiktok: 'TikTok',
  tmdb: "TMDB",
  twitter: "X"
};

const IGNORE_KEYS: string[] = [
  "freebaseMid",
  "freebaseId",
  "tvrageId"
] as const

const SOCIAL_KEYS: string[] = [
  "facebookId",
  "instagramId",
  "tiktokId",
  "twitterId",
  "youtubeId"
] as const

const DB_KEYS: string[] = [
  "freebaseId",
  "imdbId",
  "tvrageId",
  "wikidataId",
  "wikipediaId",
  "tmdbId"
] as const

function humanize(key: string) {
  let base = key.replace(/Id$/, '');
  base = base.replace(/([a-z])([A-Z])/g, '$1 $2');
  const titled = base
    .split(' ')
    .map(w => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
  return LABEL_OVERRIDES[base] ?? titled;
}

async function fetchWikiTitle(wikidataId: string): Promise<string | undefined> {
  const res = await fetch(
    `https://www.wikidata.org/w/api.php?` +
    new URLSearchParams({
      action: 'wbgetentities',
      ids: wikidataId,
      props: 'sitelinks',
      format: 'json',
      origin: '*'    // CORS
    })
  ).then(r => r.json());

  const sl = res.entities?.[wikidataId]?.sitelinks;
  return sl?.enwiki?.title;  // e.g. “Jenna_Davis”
}

function buildLinkItems(entries: [string, string | number | null][]) {
  const linkItem = entries.map(([k, v]) => {
    const label = humanize(k);
    let href = '';
    let logo = null;
    switch (k) {
      case 'facebookId':
        href = `https://facebook.com/${v}`;
        logo = <FacebookLogo width={25} height={30} alt="Facebook Logo" />
        break;
      case 'tiktokId':
        href = `https://www.tiktok.com/@${v}`
        logo = <TikTokLogo width={25} height={30} alt="TikTok Logo" />
        break;
      case 'instagramId':
        href = `https://instagram.com/${v}`;
        logo = <InstagramLogo width={25} height={30} alt="Instagram Logo" />
        break;
      case 'twitterId':
        href = `https://twitter.com/${v}`;
        logo = <XLogo width={25} height={30} alt="X Logo" />
        break;
      case 'youtubeId':
        href = `https://youtube.com/${v}`;
        logo = <YouTubeLogo width={30} height={30} alt="YouTube Logo" />
        break;
      case 'imdbId':
        href = `https://www.imdb.com/name/${v}`;
        logo = <ImdbLogo width={40} height={30} alt="IMDb Logo" />
        break;
      case 'wikidataId':
        href = `https://www.wikidata.org/wiki/${v}`;
        logo = <WikiDataLogo width={40} height={30} alt="WikiData Logo" />
        break;
      case 'wikipediaId':
        href = `https://en.wikipedia.org/wiki/${v}`;
        logo = <WikipediaLogo width={30} height={30} alt="Wikipedia Logo" />
        break;
      case 'tmdbId':
        href = `https://themoviedb.org/person/${v}`
        logo = <TmdbLogo width={40} height={30} alt="TMDB Logo" />
        break;
      default:
        href = '';
    }
    return { href, logo, label, idLabel: k, id: v }
  })
  return linkItem;
}

export default async function PersonLinks({ externalIds, tmdbId }: { externalIds: PersonExternalIdsResponse, tmdbId: number }) {
  const wikidataId = externalIds.wikidataId;
  const wikiTitle = wikidataId ? await fetchWikiTitle(wikidataId) : null;
  const ids = {
    ...externalIds,
    wikipediaId: wikiTitle ? wikiTitle : null,
    tmdbId: tmdbId.toString()
  }
  const entries = Object.entries(ids).filter(([k, v]) => v != null && v !== "" && !IGNORE_KEYS.includes(k))
  const items = buildLinkItems(entries);
  const socialLinks = items.filter(item => SOCIAL_KEYS.includes(item.idLabel))
  const dbLinks = items.filter(item => DB_KEYS.includes(item.idLabel))

  return (
    <>
      {socialLinks.length > 0 &&
        <div className="media-card space-y-2">
          <h2 className={`text-2xl font-bold`}>Social Links</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5 items-center">
            {socialLinks.map(item => (
              <li key={item.id}>
                <div className="grid grid-cols-2 items-center"><strong>{item.label}</strong>{item.logo}</div>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    <p className="hover:underline text-blue-400">
                      {item.id}
                    </p>
                  </a>
                ) : (
                  <>
                    <span>{item.label}</span>
                    <span>{item.id}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      }
      {dbLinks.length > 0 &&
        <div className="media-card space-y-2">
          <h2 className={`text-2xl font-bold`}>Database Links</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5 items-center">
            {dbLinks.map(item => (
              <li key={item.id}>
                <div className="grid grid-cols-2 items-center"><strong>{item.label}</strong>{item.logo}</div>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    <p className="hover:underline text-blue-400">
                      {item.id}
                    </p>
                  </a>
                ) : (
                  <>
                    <span>{item.label}</span>
                    <span>{item.id}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      }
    </>
  );
}
