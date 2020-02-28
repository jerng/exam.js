export { Exam }

class Exam {

    constructor ( data ) {
       
        let testCount   = 0
        let passCount   = 0
        let warnCount   = 0
        let concerns    = []

        console.group ( 'Examination Results!' )

        console.log ( `
**  (new Exam)!
*
*   Number of concerns : ${data.concerns.length}
*
*   ... commencing construction...
**`)

        console.groupCollapsed ('Concerns: initial execution context; loop ran synchronously:' )

        for ( const i in data.concerns ) {

            let render
            let concernExecutor = ( fulfill, reject ) => {

/** LOGIC MAP
 *
 *          IF the Concern is a Warning, then RETURN. 
 *
 *  (> Hereon, the Concern is implicitly a Test.)
 *          
 *          IF the Test Expects-an-error, then THROW failure or RETURN success.
 *
 *              Synchronous     : OK
 *
 *              Asynchronous    : Not Supported <-FIXME--------------------------- FIXME
 *
 *  (> Hereon, the Test implicitly Expects-NO-error.)
 *
 *          IF the Test's Want is not defined, then THROW.
 *
 *          ELSE if the Test's Want is 'vfun', then
 *
 *                  IF 'vfun' is missing, then THROW.
 *        
 *                  ELSE if the Test returned a Promise, then THROW failure or RETURN success.
 *
 *                      Asynchronous    : OK
 *        
 *      (> Hereon, the Test implicitly is synchronous.)
 *        
 *                  ELSE if the Test's 'vfun' returns anything but TRUE, then THROW.
 *
 *                      Synchronous : OK
 *
 *          ELSE if the Test's Want is 'legible', then THROW failure or RETURN success.
 *
 *  (> Hereon, the Test implicitly demands only the Wanted value.)
 *
 *          ELSE if the Test returned a Promise, then THROW failure or RETURN success.
 *
 *              Asynchronous    : OK
 *  
 *  (> Hereon, the Test implicitly is synchronous.)
 *
 *          ELSE if the Test returned anything but the Wanted value, then THROW.
 *
 *              Synchronous : OK
 *
 *  (> Hereon, the Test should have RETURNED success, via 'vfun returned TRUE'
 *  or 'demands only the Wanted value' if it has not, it will now do so.)
 *
 *
 *
 */

A_WARNING_NOT_A_TEST: 
{ 
                if ( data.concerns[i].warning ) {

                    warnCount ++
                    let currentWarnCount = parseInt ( warnCount)
                    render = () => {
                        console.group   ( `Warning: #${ currentWarnCount }` )
                        console.warn    ( data.concerns[i].warning )
                        console.groupEnd()
                    }
                    fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                    return // concernExecutor

                } // if 

} // A_WARNING_NOT_A_TEST

// Implicit: if Concern is not a Warning, then it must be a Test.

                testCount ++
                let currentTestCount = parseInt ( testCount)
                let returned

TEST_WHERE_ERROR_EXPECTED: 
{   
                if ( data.concerns[i].expectError ) {

                    let errorThrown     = false
                    try {

                        returned        = data.concerns[i].code()

                    } catch (e) {

                        errorThrown     = true 
                        passCount ++ 

                        render = () => {
                            console.groupCollapsed      ( `Test: #${ currentTestCount } passed (caught an Error) - ${ data.concerns[i].test }` )
                            console.log                 ( `
*   Caught  : ${ e }
*   Returned: ${ returned }`) 
                            {   console.groupCollapsed  ( `Code:` )
                                console.log             ( data.concerns[i].code.toString() )
                                console.groupEnd        ()
                            }
                            console.groupEnd            ()
                        }
                        fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                        return // concernExecutor

                    } finally {
                        
                        if ( ! errorThrown ) {
                            
                            render = () => {
                                console.group       ( `Test: #${ currentTestCount } failed (caught no Error) - ${ data.concerns[i].test }` )
                                console.error       ( `
*   Returned: ${ returned }`) 
                                {   console.group   ( `Code:` )
                                    console.error   ( data.concerns[i].code.toString() )
                                    console.groupEnd()
                                }
                                console.groupEnd    ()
                            }
                            fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                            return // concernExecutor

                        } // if ( ! errorThrown)

                    } // finally
                    
                } // if 

} // TEST_WHERE_ERROR_EXPECTED

TEST_WHERE_ERROR_NOT_EXPECTED:
{
                try {   
                    returned = data.concerns[i].code()  

                    if ( ! ( 'want' in data.concerns[i] ) ) 
                    {
                        throw `Writers of this test did not specify what they wanted.`
                    }
                    else if (   typeof data.concerns[i].want        == 'string' // redundant with 'legible' 
                            &&  data.concerns[i].want.toLowerCase() == 'vfun' ) 
                    {

                        if ( ! ( 'vfun' in data.concerns[i] ) ) 
                        {
                            throw `Writers of this test did not specify the validation function.`
                        }

// Explicit: Validation function IS expected:
// Explicit: Asynchronous test result handler:

                        else if ( returned instanceof Promise )
                        {
                            
                            let onFulfill   = fValue    => {

                                if ( data.concerns[i].vfun ( fValue ) !== true ) {

                                    throw `
*   We wanted the code to return a Promise fulfiled with the value, RV, where VFUN(RV) returns (true), given a validation function, VFUN, whose body is : 

${ data.concerns[i].vfun.toString() } 

*
*   Returned: a Promise
*       State   : fulfilled
*       Value   : ${fValue}`
                                }
                                
                                passCount ++
                                
                                // This code is redundant with this code
                                // TAG: EXPECT_NO_ERROR_RENDER_NO_ERROR FIXME 
                                render = () => {
                                    console.groupCollapsed      ( `Test: #${ currentTestCount } passed - ${ data.concerns[i].test }` )
                                    console.log                 ( `
*   Returned: a Promise
*       State   : fulfilled
*       Value   : ${ fValue }`) 
                                    {   console.groupCollapsed  ( `Code:` )
                                        console.log             ( data.concerns[i].code.toString() )
                                        console.groupEnd        ()
                                    }
                                    console.groupEnd            ()
                                }
                                fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                            }

                            let onReject    = rReason   => {
                                throw `
*   Returned: a Promise 
*       State   : rejected
*       Reason  : ${rReason}`
                            }

                            let onCatch     = error => {
                                // This code is redundant with this code
                                // TAG: EXPECT_NO_ERROR_RENDER_ERROR FIXME 
                                render = () => {
                                    console.group       ( `Test: #${ currentTestCount } failed - ${ data.concerns[i].test }` )
                                    console.error       ( `
*   Caught  : ${ error }`) 
                                    {   console.group   ( `Code:` )
                                        console.error   ( data.concerns[i].code.toString() )
                                        console.groupEnd()
                                    }
                                    console.groupEnd()
                                }
                                fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                            }                          

                            let asyncTestCode = returned    .then   ( onFulfill, onReject )
                                                            .catch  ( onCatch )
                            return // concernExecutor
                        }

// Explicit: Validation function IS expected:
// Implicit: Synchronous test result handler:

                        else if ( data.concerns[i].vfun ( returned ) !== true )
                        {
                            throw   `
*   We wanted the code to return a value, RV, where VFUN(RV) returns (true), given a validation function, VFUN, whose body is : 

${ data.concerns[i].vfun.toString() }

*
*   Returned: ${returned}`

                        }

// Implicit: By this line, the vfun(returned) must be TRUE
                    
                    } 

// Implicit: By this line, we know we're not looking for a vfun
                    
                    else if (   typeof data.concerns[i].want        == 'string' // redundant with 'vfun'
                            &&  data.concerns[i].want.toLowerCase() == 'legible' ) 
                    {
                        render = () => {
                            console.group               ( `Test: #${ currentTestCount } passed - ${ data.concerns[i].test }` )
                            console.warn                ( `
*   Returned: ${ returned }`) 
                            {   console.groupCollapsed  ( `Code:` )
                                console.log             ( data.concerns[i].code.toString() )
                                console.groupEnd        ()
                            }
                            console.groupEnd            ()
                        }
                        fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                        return // concernExecutor
                    }
                    
// Implicit: Validation function NOT expected:
// Explicit: Asynchronous test result handler: 

                    else if ( returned instanceof Promise) 
                    {
                        let onFulfill   = fValue    => {

                            if ( fValue !== data.concerns[i].want ) {

                                throw `
*   We wanted the code to return a Promise fulfiled with the value : ${data.concerns[i].want}
*
*   Returned: a Promise
*       State   : fulfilled
*       Value   : ${fValue}`
                            }
                            
                            passCount ++
                            
                            // This code is redundant with this code
                            // TAG: EXPECT_NO_ERROR_RENDER_NO_ERROR FIXME 
                            render = () => {
                                console.groupCollapsed      ( `Test: #${ currentTestCount } passed - ${ data.concerns[i].test }` )
                                console.log                 ( `
*   Returned: a Promise
*       State   : fulfilled
*       Value   : ${ fValue }`) 
                                {   console.groupCollapsed  ( `Code:` )
                                    console.log             ( data.concerns[i].code.toString() )
                                    console.groupEnd        ()
                                }
                                console.groupEnd            ()
                            }
                            fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                        }

                        let onReject    = rReason   => {
                            throw `
*   Returned: a Promise 
*       State   : rejected
*       Reason  : ${rReason}`
                        }

                        let onCatch     = error => {
                            // This code is redundant with this code
                            // TAG: EXPECT_NO_ERROR_RENDER_ERROR FIXME 
                            render = () => {
                                console.group       ( `Test: #${ currentTestCount } failed - ${ data.concerns[i].test }` )
                                console.error       ( `
*   Caught  : ${ error }`) 
                                {   console.group   ( `Code:` )
                                    console.error   ( data.concerns[i].code.toString() )
                                    console.groupEnd()
                                }
                                console.groupEnd()
                            }
                            fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                        }                          

                        let asyncTestCode = returned    .then   ( onFulfill, onReject )
                                                        .catch  ( onCatch )
                        return // concernExecutor

                    } // else if ( returned instanceof Promise )

// Implicit: Validation function NOT expected:
// Implicit: Synchronous test result handler: 

                    else if ( returned !== data.concerns[i].want )
                    {
                        throw `We wanted the code to return : ${data.concerns[i].want}`
                    }

// Implicit: Synchronous test has passed. 

                    passCount ++

                    // This code is redundant with this code
                    // TAG: EXPECT_NO_ERROR_RENDER_NO_ERROR FIXME 
                    render = () => {
                        console.groupCollapsed      ( `Test: #${ currentTestCount } passed - ${ data.concerns[i].test }` )
                        console.log                 ( `
*   Returned: ${ returned }`) 
                        {   console.groupCollapsed  ( `Code:` )
                            console.log             ( data.concerns[i].code.toString() )
                            console.groupEnd        ()
                        }
                        console.groupEnd            ()
                    }
                    fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                    return // concernExecutor

                } catch (e) {   
               
                    // This code is redundant with this code
                    // TAG: EXPECT_NO_ERROR_RENDER_ERROR FIXME 
                    render = () => {
                        console.group       ( `Test: #${ currentTestCount } failed - ${ data.concerns[i].test }` )
                        console.error       ( 
`
*   Returned: ${ returned }
*   Message : ${ e }`) 
                        {   console.group   ( `Code:` )
                            console.error   ( data.concerns[i].code.toString() )
                            console.groupEnd()
                        }
                        console.groupEnd()
                    }
                    fulfill ( Object.assign ( data.concerns[i], { render : render } ) )
                    return // concernExecutor

                } // catch

} // TEST_WHERE_ERROR_NOT_EXPECTED

            } // concernExecutor

            let currentConcernPromise = new Promise ( concernExecutor )
            concerns.push ( currentConcernPromise )

        } // for ( const i in data.concerns ) 

        console.groupEnd ( 'Concerns: initial execution context; loop ran synchronously:' )

        
        {
            console.log     ( `
**
*   ... all Concerns have now been despatched, to asynchronous jobs;
*       next, asynchronous job execution will return further results:
**` )
            // After all test promises have been fulfilled, report:
            Promise.all ( concerns ).then ( fValues => {
                
                console.group ( `Concerns (${concerns.length}) : loop through asynchronous execution contexts:` )

                    let partitioned = fValues.reduce ( 
                        ( acc, val ) => {

                        if          ( val.warning )             { acc.warnings.push ( val )
                        } else if   ( val.want == 'legible' )   { acc.tests.legibility.push ( val )
                        } else                                  { acc.tests.verifiable.push ( val )
                        }

                            return acc
                        }, 
                        {   warnings: [],
                            tests   : {
                                verifiable  : [],
                                legibility  : []
                            }
                        } 
                    )

                    console.groupCollapsed ( `Warnings (${partitioned.warnings.length}):`)
                    partitioned.warnings.forEach ( ac => ac.render() )
                    console.groupEnd ( `Warnings (${partitioned.warnings.length}):`)
                
                    console.groupCollapsed ( `Machine Verifiable Tests (${partitioned.tests.verifiable.length}):`)
                    partitioned.tests.verifiable.forEach ( ac => ac.render() )
                    console.groupEnd ( `Machine Verifiable Tests (${partitioned.tests.verifiable.length}):`)
                
                    console.groupCollapsed ( `Human Legibility Tests (${partitioned.tests.legibility.length}):`)
                    partitioned.tests.legibility.forEach ( ac => ac.render() )
                    console.groupEnd ( `Human Legibility Tests (${partitioned.tests.legibility.length}):`)
                
                console.groupEnd ( `Concerns (${concerns.length}) : loop through asynchronous execution contexts:` )
                
                console.log (
`
**  ... (new Exam) constructed.
*   
*   Number of tests failed -----: ${testCount - passCount}
*   Number of tests passed      : ${passCount}
*
*   Number of tests (total)     : ${testCount}
*   Number of warnings logged   : ${warnCount}
*   
*   Number of concerns (total)  : ${data.concerns.length}
*   
*   No further results.
**`)

console.groupEnd ( 'Examination Results!' )

            } )

        }

    } // constructor()   

} // class Exam