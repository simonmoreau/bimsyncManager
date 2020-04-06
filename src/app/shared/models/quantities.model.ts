export enum GroupingModeEnum {
    DontSummarize,
    Count,
    CountDistinct,
    First,
    Last,
    Sum,
    Average,
    Minimun,
    Maximun,
    StandardDeviation,
    Variance,
    Median
}

export enum SortEnum {
    Up,
    Down,
    ToTop,
    ToBottom
}

export class GroupingMode {

    isEnabled: boolean;
    mode: GroupingModeEnum;

    private _modeName: string;

    constructor(groupingModeEnum?: GroupingModeEnum) {
        this.mode = groupingModeEnum || GroupingModeEnum.DontSummarize;
        this.isEnabled = false;
    }

    get modeName(): string {
        return this.GetGroupingModeDisplay();
    }

    get modeText(): string {
        return this.GetGroupingModeText();
    }

    private GetGroupingModeDisplay(): string {
        switch (this.mode) {
            case GroupingModeEnum.DontSummarize: {
                return 'Don\'t Summarize';
            }
            case GroupingModeEnum.Count: {
                return 'Count';
            }
            case GroupingModeEnum.CountDistinct: {
                return 'Count (Distinct)';
            }
            case GroupingModeEnum.First: {
                return 'First';
            }
            case GroupingModeEnum.Last: {
                return 'Last';
            }
            case GroupingModeEnum.Sum: {
                return 'Sum';
            }
            case GroupingModeEnum.Average: {
                return 'Average';
            }
            case GroupingModeEnum.Minimun: {
                return 'Minimun';
            }
            case GroupingModeEnum.Maximun: {
                return 'Maximun';
            }
            case GroupingModeEnum.StandardDeviation: {
                return 'Standard Deviation';
            }
            case GroupingModeEnum.Variance: {
                return 'Variance';
            }
            case GroupingModeEnum.Median: {
                return 'Median';
            }
            default: {
                return 'Don\'t Summarize';
            }
        }
    }

    private GetGroupingModeText(): string {
        switch (this.mode) {
            case GroupingModeEnum.DontSummarize: {
                return '';
            }
            case GroupingModeEnum.Count: {
                return 'Count of ';
            }
            case GroupingModeEnum.CountDistinct: {
                return 'Count of ';
            }
            case GroupingModeEnum.First: {
                return 'First ';
            }
            case GroupingModeEnum.Last: {
                return 'Last ';
            }
            case GroupingModeEnum.Sum: {
                return 'Sum of ';
            }
            case GroupingModeEnum.Average: {
                return 'Average of ';
            }
            case GroupingModeEnum.Minimun: {
                return 'Min of ';
            }
            case GroupingModeEnum.Maximun: {
                return 'Max of ';
            }
            case GroupingModeEnum.StandardDeviation: {
                return 'Standard deviation of ';
            }
            case GroupingModeEnum.Variance: {
                return 'Variance of ';
            }
            case GroupingModeEnum.Median: {
                return 'Median of ';
            }
            default: {
                return '';
            }
        }
    }
}