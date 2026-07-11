export function getRetryDelay(attempt: number): number {

    switch(attempt){

        case 1:
            return 10000;

        case 2:
            return 30000;

        case 3:
            return 120000;

        case 4:
            return 600000;

        case 5:
            return 1800000;

        default:
            return -1;
    }

}