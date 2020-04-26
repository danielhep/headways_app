import _ from 'highland'
/* eslint camelcase: "off" */
export async function getFrequentStops (stops, stopTimes) {
  // create an object for each stop with the connecting stops
  const SStopTimes = _(stopTimes)
  const stopMapping = await _(stops).map(stop => {
    const nextStops = {}
    SStopTimes.filter(({ stop_id }) => stop_id === stop.stop_id)
      .each(({ departure_time, next_stop_id }) => {
        nextStops[next_stop_id] = [...nextStops[next_stop_id], departure_time]
      })
    return nextStops
  })
  console.log(stopMapping.toArray())
}
