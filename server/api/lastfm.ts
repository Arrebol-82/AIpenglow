type LastFmImage = {
  '#text'?: string
  size?: string
}

type LastFmTrack = {
  name?: string
  url?: string
  artist?: {
    '#text'?: string
  }
  album?: {
    '#text'?: string
  }
  image?: LastFmImage[]
  date?: {
    '#text'?: string
    uts?: string
  }
  '@attr'?: {
    nowplaying?: string
  }
}

type LastFmResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack
  }
}

const resolveTrackImage = (images: LastFmImage[] = []) =>
  [...images].reverse().find(image => image?.['#text'])?.['#text'] ?? null

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const endpoint = config.lastfmEndpoint
  const apiKey = config.lastfmApiKey
  const user = config.lastfmUser
  const hasCredentialConfig = Boolean(apiKey && user)

  if (!endpoint && !hasCredentialConfig) {
    return {
      ok: false,
      reason: 'not_configured',
      track: null
    }
  }

  try {
    const data = hasCredentialConfig
      ? await $fetch<LastFmResponse>('https://ws.audioscrobbler.com/2.0/', {
          query: {
            method: 'user.getrecenttracks',
            user,
            api_key: apiKey,
            format: 'json',
            limit: 1
          }
        })
      : await $fetch<LastFmResponse>(endpoint)

    const rawTrack = Array.isArray(data.recenttracks?.track)
      ? data.recenttracks.track[0]
      : data.recenttracks?.track

    if (!rawTrack) {
      return {
        ok: false,
        reason: 'empty',
        track: null
      }
    }

    const payload = {
      ok: true,
      reason: null,
      track: {
        name: rawTrack.name ?? '',
        artist: rawTrack.artist?.['#text'] ?? '',
        album: rawTrack.album?.['#text'] ?? '',
        image: resolveTrackImage(rawTrack.image),
        url: rawTrack.url ?? null,
        isNowPlaying: rawTrack['@attr']?.nowplaying === 'true',
        listenedAt: rawTrack.date?.['#text'] ?? null
      }
    }

    return payload
  }
  catch (error) {
    console.error('[lastfm] Failed to fetch recent track:', error)

    return {
      ok: false,
      reason: 'fetch_failed',
      track: null
    }
  }
})
