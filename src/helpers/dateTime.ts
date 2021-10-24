import _ from 'lodash'
import dayjs from '@/plugins/dayjs'

export function diffForHumans(start: string, end: string): string {
  const startTime = dayjs(start)
  const endTime = dayjs(end)

  const diff = dayjs.duration(startTime.diff(endTime))
  const diffParts = [
    diff.days() ? `${diff.days()}d` : null,
    diff.hours() ? `${diff.hours()}h` : null,
    diff.minutes() ? `${diff.minutes()}m` : null,
    diff.seconds() ? `${diff.seconds()}s` : null,
  ]

  return _.chain(diffParts).filter().take(2).join(' ').value()
}

export function diffInSeconds(start: string, end?: string): number {
  return Math.abs(dayjs(end).diff(start, 'seconds'))
}

export function fromNowHumanized(time: string): string {
  const diff = dayjs.duration(dayjs().diff(dayjs(time)))
  const diffParts = [
    Math.abs(diff.days()) ? `${Math.abs(diff.days())}d` : null,
    Math.abs(diff.hours()) ? `${Math.abs(diff.hours())}h` : null,
    Math.abs(diff.minutes()) ? `${Math.abs(diff.minutes())}m` : null,
    Math.abs(diff.seconds()) ? `${Math.abs(diff.seconds())}s` : null,
  ]

  return _.chain(diffParts).filter().take(2).join(' ').value()
}

export function wholeDatesBetween(start: string, end: string, utc = false): string[] {
  let startTime = utc ? dayjs.utc(start) : dayjs(start)
  let endTime = utc ? dayjs.utc(end) : dayjs(end)

  if (!startTime.isSame(startTime.startOf('day'))) {
    startTime = startTime.startOf('day').add(1, 'day')
  }

  if (!endTime.isSame(endTime.startOf('day'))) {
    endTime = endTime.startOf('day')
  }

  const dates = []

  while (!startTime.isSame(endTime)) {
    dates.push(startTime.format('YYYY-MM-DD'))

    startTime = startTime.add(1, 'day')
  }

  return dates
}
