import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import Image from 'next/image'

// Link bank account with Plaid
const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState('');

    // Create link token
    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);

            setToken(data?.linkToken);
        }
        getLinkToken();
    }, [user]);

    // Exchange link token
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user,
        })

        router.push('/');
    }, [user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === 'primary' ? (
                <Button 
                    onClick={() => open()}
                    disabled={!ready}
                    className='plaidlink-primary'
                >
                    Connect Account
                </Button>
            ) : variant === 'ghost' ? (
                <Button onClick={() => open()} variant='ghost' className='plaidlink-ghost'>
                <Image 
                    src='/icons/connect-bank.svg'
                    alt='Connect Account'
                    width={24}
                    height={24}
                />
                <p className='text-[16px] font-semibold text-black-2 xl:block'>Connect Account</p>
                </Button>
            ) : (
                <Button onClick={() => open()} className='plaidlink-default'>
                    <Image 
                        src='/icons/connect-bank.svg'
                        alt='Connect Account'
                        width={24}
                        height={24}
                    />
                    <p className='text-[16px] font-semibold text-black-2 sidebar-label'>Connect Account</p>
                </Button>
            )}
        </>
    )
}

export default PlaidLink